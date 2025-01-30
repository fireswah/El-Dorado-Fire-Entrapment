/*
Component to open href links with a target of a new tab, rather than traversing with the same tab.
Intent is to keep the user in the same scene and providing the linked resource in a separate tab.
*/
AFRAME.registerComponent('href-target', {
	schema: {
        url: { type: 'string', default: '' },
	},

	init: function () {
		var data = this.data;
		var el = this.el;

        el.addEventListener( 'click', ( e ) => {
            //opens the link in a named tab.  Behavior should be just one tab that is re-used for the links in scene, so the user doesn't end up with many open tabs.
            window.open( data.url, 'openlinktab' );
        });
	},

	update: function () {},

	tick: function () {},

	remove: function () {},

	pause: function () {},

	play: function () {},

});