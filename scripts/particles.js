/*
	Copyright 2025 Matt Gibson
        Basic particle system component:
		-Can handle rotation around center, "drift" along with color change and blend modes required for CRVP displays
		-Very thankful for SimonDev's tutorial @ https://www.youtube.com/watch?v=OFqENgtqRAY

        This program is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        any later version.

        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
AFRAME.registerComponent('particle_system', {
	schema: {
		imagepath: { type: 'string', default: '' },
		colorCurve: { type: 'string', default: '0.9, 0.7, 0.0, 0.8 | 0.6, 0.2, 0.2, 1.0 | 0.4, 0.2, 0.2, 0.3 | 0.2, 0.2, 0.2, 0.3' },//list of 4 RGBA values in one string, separated with pipe for parsing
		particleSize: { type: 'number', default: 5.0 },//base particle size
		particleSizeRandomize: { type: 'boolean', default: true },//adds randomness based on particleSize if true. If false, all particles will be particleSize
		particleNumber: { type: 'int', default: 50 },//how many particles will be spawned
		lifetime: { type: 'int', default: 5 },//how long each particle lives before resetting
		xdriftCurve: { type: 'array', default: [ 0, 0, 0, 0 ] },//linear x driftspeed factor
		zdriftCurve: { type: 'array', default: [ 0, 0, 0, 0 ] },//linear z driftspeed factor
		yCurve: { type: 'array', default: [ 5.0, 0.8, 0.0 ] },//linear y (rise) over age of particle
		orbitSpeedCurve: { type: 'array', default: [ 0.0, -3.14, -6.28 ] },//orbital movement from origin over age of particle
		blendMode: { type: 'int', default: 2 },//0 = NoBlending, 1 = THREE.NormalBlending, 1 -THREE.AdditiveBlending, etc.
	},

	init: function () {
		var data = this.data;
		var el = this.el;
    	var scene = el.sceneEl;

		var textureLoader = new THREE.TextureLoader();

		this.points = new THREE.BufferGeometry();

		//Parse color arrays from schema
		var colorCurveString = data.colorCurve;
		var colorCurveArray = colorCurveString.split( '|' ).map( ( colorString ) => {
			return colorString.split( ',' ).map( ( value ) => parseFloat( value.trim() ) );
		});

		this.addParticles();

		uniforms = {
			"smokeImage": { value: textureLoader.load( data.imagepath, ( texture ) => { texture.flipY = false; } ) },
			"size": { value: data.particleSize },
			"colors": { value: new Float32Array( colorCurveArray.flat() ) },
			"xdriftCurve": { value: new Float32Array(this.data.xdriftCurve) },
			"zdriftCurve": { value: new Float32Array(this.data.zdriftCurve) },
			"yCurve": { value: new Float32Array(this.data.yCurve) },
			"orbitSpeedCurve": { value: new Float32Array(this.data.orbitSpeedCurve) },
		};

		var particleMaterial = new THREE.ShaderMaterial( {
                
			uniforms: uniforms,

			vertexShader: `
				uniform float xdriftCurve[ 4 ];
				uniform float zdriftCurve[ 4 ];
				uniform float yCurve[ 3 ];
				uniform float orbitSpeedCurve[ 3 ];

				attribute float size;
				attribute float age;
				attribute float lifetime;

				out float vNormalizedAge;

				float getXDrift( float normalizedAge ) {
					if ( normalizedAge < 0.33 ) {
						return mix( xdriftCurve[ 0 ], xdriftCurve[ 1 ], normalizedAge / 0.33 );
					} else if ( normalizedAge < 0.66 ) {
						return mix( xdriftCurve[ 1 ], xdriftCurve[ 2 ], ( normalizedAge - 0.33 ) / 0.33 );
					} else {
						return mix( xdriftCurve[ 2 ], xdriftCurve[ 3 ], ( normalizedAge - 0.66 ) / 0.34 );
					}
				}

				float getZDrift( float normalizedAge ) {
					if ( normalizedAge < 0.33 ) {
						return mix( zdriftCurve[ 0 ], zdriftCurve[ 1 ], normalizedAge / 0.33 );
					} else if ( normalizedAge < 0.66 ) {
						return mix( zdriftCurve[ 1 ], zdriftCurve[ 2 ], ( normalizedAge - 0.33 ) / 0.33 );
					} else {
						return mix( zdriftCurve[ 2 ], zdriftCurve[ 3 ], ( normalizedAge - 0.66 ) / 0.34 );
					}
				}

				float getYFactor( float nage ) {
					if ( nage < 0.5 ) {
						return mix( yCurve[ 0 ], yCurve[ 1 ], nage * 2.0 );
					} else {
						return mix( yCurve[ 1 ], yCurve[ 2 ], ( nage - 0.5 ) * 2.0 );
					}
				}

				float getOrbitSpeed( float nage ) {
					if ( nage < 0.5 ) {
						return mix( orbitSpeedCurve[ 0 ], orbitSpeedCurve[ 1 ], nage * 2.0 );
					} else {
						return mix( orbitSpeedCurve[ 1 ], orbitSpeedCurve[ 2 ], ( nage - 0.5 ) * 2.0 );
					}
				}

				void main()
				{
					vNormalizedAge = clamp( age / lifetime, 0.0, 1.0 );

					float orbitSpeed = getOrbitSpeed( vNormalizedAge );//6.283185 * 2.0;

					float xdriftSpeed = getXDrift( vNormalizedAge );//xdriftCurve[ 2 ];
					float zdriftSpeed = getZDrift( vNormalizedAge );//zdriftCurve[ 0 ];

					float angle = vNormalizedAge * orbitSpeed;

					float orbitX = cos( angle ) * position.x - sin( angle ) * position.z;
					float orbitZ = sin( angle ) * position.x + cos( angle ) * position.z;

					float driftX = vNormalizedAge * xdriftSpeed;
  					float driftZ = vNormalizedAge * zdriftSpeed;

					float newX = orbitX + driftX;
					float newZ = orbitZ + driftZ;
					float newY = getYFactor( vNormalizedAge );


					vec4 mvPosition = modelViewMatrix * vec4( newX, newY, newZ, 1.0 );

					gl_PointSize = size;
					gl_Position = projectionMatrix * mvPosition;
				}
			`,

			fragmentShader: `
				uniform sampler2D smokeImage;
				uniform vec4 colors[4];

				in float vNormalizedAge;

				vec4 getColor( float normalizedAge ) {
				
					normalizedAge = clamp( normalizedAge, 0.0, 1.0 );

						if( normalizedAge < 0.3 ) {
							return mix( colors[ 0 ], colors[ 1 ], normalizedAge / 0.33 );
						} else if ( normalizedAge < 0.66 ) {
							return mix( colors[ 1 ], colors[ 2 ], ( normalizedAge - 0.33 ) / 0.33 );
						} else {
							return mix( colors[ 2 ], colors[ 3 ], ( normalizedAge - 0.66 ) / 0.34 );
						}
				}

				void main( void ) {

					vec4 pointColor;

					pointColor = vec4( getColor( vNormalizedAge ) );

					gl_FragColor = texture2D( smokeImage, gl_PointCoord ) * pointColor;
				}
			`
			,
			blending: data.blendMode,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			forceSinglePass: true
		});

		var particles = new THREE.Points( this.points, particleMaterial );
		el.setObject3D( 'mesh', particles );

	},

	//Creates the initial particles and sets buffer attributes
	addParticles: function () {
		//Create vec3 point positions
		var data = this.data;
		var x, y, z = 0;
		var points_pos = [];
		var sizes = [];
		var maxLifeTime = [];
		var age = [];

		for( var p = 0; p < data.particleNumber; p++ ) {
			//initial position
			x = ( Math.random() * 2 - 1 ) * 1.0;//random that also centers at 0
			y = ( Math.random() * 2 - 1 ) * 1.0;//don't subract on the y axis so things start at 0 elevation
			z = ( Math.random() * 2 - 1 ) * 1.0;//random that also centers at 0
			points_pos.push( x, y, z );
			//initial size
			if( data.particleSizeRandomize == true ) {
				sizes.push( data.particleSize * ( Math.random() * 2 ) );
			}else {
				sizes.push( data.particleSize * 1.0 );
			}
			//randomized lifetime given the user's input
			maxLifeTime.push( Math.random() * data.lifetime + data.lifetime );
			//starting age
			age.push( 0.0 );

		}
		this.points.setAttribute( 'position', new THREE.Float32BufferAttribute( points_pos, 3 ) );;
		this.points.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ) );
		this.points.setAttribute( 'lifetime', new THREE.Float32BufferAttribute( maxLifeTime, 1 ) );
		this.points.setAttribute( 'age', new THREE.Float32BufferAttribute( age, 1 ) );
		//color is managed through glsl and the colorCurve instead of bufferattribute
	},
	
	//Run through the tick().  Updates age and resets position once age is exceeded to give
	//a more random look.
	updateGeometry: function ( deltaTime ) {
		var data = this.data;
		var uPos = this.points.getAttribute( 'position' );
		var uAge = this.points.getAttribute( 'age' );
		var uLifetime = this.points.getAttribute( 'lifetime' );

		for( var p = 0; p < uPos.count; p++ ) {
			//update Age
			if( uAge.array[ p ] > uLifetime.array[ p ] ){
				uAge.array[ p ] = 0;
			}else {
				uAge.array[ p ] += deltaTime;
			}
			//update position with re-randomize x and y starting location when lifetime reached
			if( uAge.array[ p ] / data.lifetime >= 1.0 ) {
				uPos.setX( p, ( Math.random() * 2 - 1 ) * 1.0 );
				uPos.setY( p + 1, ( Math.random() * 2 - 1 ) * 1.0 );
				uPos.setZ( p + 2, ( Math.random() * 2 - 1 ) * 1.0 );
			}
		}
		//update buffer attributes
		this.points.attributes.age.needsUpdate = true;

	},

	update: function () {},

	remove: function () {},

	pause: function () {},

	play: function () {},

	tick: function ( time, deltaTime ) {

		this.elapsedTime += deltaTime;

		//update particle age and position
		this.updateGeometry( deltaTime / 1000 );
	},

});
