/*
	Copyright 2025 Matt Gibson
        href target component:
		-Component to open href links with a target of a new tab, rather than traversing with the same tab.
		-Intent is to keep the user in the same scene and providing the linked resource in a separate tab.

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
