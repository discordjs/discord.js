.. include:: ./vars.rst

Embeds
======

Embeds are parts of Messages that are sort-of like a preview. They are created serverside by Discord, so in real-time they would come through as part of a `messageUpdate` event. When grabbing messages from logs, they will already be embedded as part of the array ``message.embeds``.

All the Embed classes extend ``Discord.Embed``.

Link Embed
----------

A Link Embed is an embed showing a preview of any linked site in a message.

Attributes
~~~~~~~~~~

.. code-block:: js

	{
		url, // the URL of the link
		type : "link",
		title, // title of the embed/URL
		thumbnail : {
			width, // the width of the thumbnail in pixels
			height, // the height of the thumbnail in pixels
			url, // the direct URL to the thumbnail
			proxy_url, // a proxy URL to the thumbnail
		},
		provider : {
			url, // ???
			name, // ???
		},
		description, // description of the embed
		author : {
			url, // URL to the author (if any)
			name // name of the author (if any)
		}
	}
	

Image Embed
-----------

An Image Embed shows an image of a referenced link

Attributes
~~~~~~~~~~

.. code-block:: js

	{
		url, // the URL of the image
		type : "image",
		title, // title of the embed/image
		thumbnail : {
			width, // the width of the thumbnail in pixels
			height, // the height of the thumbnail in pixels
			url, // the direct URL to the thumbnail
			proxy_url, // a proxy URL to the thumbnail
		},
		provider : {
			url, // ???
			name, // ???
		},
		description, // description of the embed
		author : {
			url, // URL to the author (if any)
			name // name of the author (if any)
		}
	}
	

Video Embed
-----------

A Video Embed embeds videos (e.g. youtube)

Attributes
~~~~~~~~~~

.. code-block:: js

	{
		url, // the URL of the image
		type : "image",
		title, // title of the embed/image
		thumbnail : {
			width, // the width of the thumbnail in pixels
			height, // the height of the thumbnail in pixels
			url, // the direct URL to the thumbnail
			proxy_url, // a proxy URL to the thumbnail
		},
		provider : {
			url, // ???
			name, // ???
		},
		description, // description of the embed
		author : {
			url, // URL to the author (if any)
			name // name of the author (if any)
		},
		video : {
			width, // the width of the embedded video player
			height, // the height of the embedded video player
			url // the URL of the embedded play
		}
	}