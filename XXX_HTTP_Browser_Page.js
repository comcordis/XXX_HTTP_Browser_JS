var XXX_HTTP_Browser_Page =
{
	uri: '',
	referrerURI: '',
	
	initialize: function ()
	{
		this.uri = location.href;
		
		this.referrerURI = document.referrer ? document.referrer : (document.referer ? document.referer : false);
		
		this.getDocumentBody();
	},
	
	////////////////////
	// URI
	////////////////////
	
	goToURI: function (uri, historyRecord)
	{		
		if (historyRecord)
		{
			location.href = uri;
		}
		else
		{
			location.replace(uri);
		}
	},
	
	getURI: function ()
	{
		return this.uri;
	},
	
	getReferrerURI: function ()
	{
		return this.referrerURI;
	},
	
	////////////////////
	// Anchor
	////////////////////
	
	jumpToAnchor: function (anchorName, historyRecord)
	{
		this.goToURI('#' + anchorName, historyRecord);
	},
	
	////////////////////
	// Document body
	////////////////////
	
	documentBody: false,
	
	getDocumentBody: function ()
	{
		var result = false;
		
		if (this.documentBody)
		{
			result = this.documentBody;
		}
		else
		{		
			if (document.compatMode && document.compatMode != 'BackCompat')
			{
				result = document.documentElement;
			}
			else if (document.body)
			{
				result = document.body;
			}
			else if (document.getElementsByTagName("body")[0])
			{
				result = document.getElementsByTagName("body")[0];
			}
			
			this.documentBody = result;
		}
		
		return result;
	},
	
	////////////////////
	// Frames
	////////////////////
	
	// Potential security hazard so always use, if the frame it's included in logs keystrokes etc.
	
	breakOutOfFrame: function ()
	{
		if (window.top != window.self) 
		{
			window.top.location = window.self.location;
		}
	},
		
	////////////////////
	// Size
	////////////////////
	
	getSize: function ()
	{
		var result =
		{
			width: 0,
			height: 0
		};
		
		var width = 0;
		var height = 0;
				
		if ((window.innerHeight && window.scrollMaxY) || (window.innerWidth && window.scrollMaxY))
		{
			result =
			{
				width: window.innerWidth + window.scrollMaxX,
				height: window.innerHeight + window.scrollMaxY
			};
		}
		else
		{
			var documentBody = this.getDocumentBody();
			
			if (documentBody.scrollHeight > documentBody.offsetHeight || documentBody.scrollWidth > documentBody.offsetWidth)
			{
				result =
				{
					width: documentBody.scrollWidth,
					height: documentBody.scrollHeight
				};
			}
			else
			{
				result =
				{
					width: documentBody.offsetWidth,
					height: documentBody.offsetHeight
				};
			}
		}
		
		return result;
	},
	
	////////////////////
	// Zoom
	////////////////////
	
	// TODO ???
	getZoom: function ()
	{
		var zoom = 1;
		var temp = false;
		
		if (XXX_HTTP_Browser.browser == 'safari' || XXX_HTTP_Browser.browser == 'chrome')
		{
			temp = parseInt(document.defaultView.getComputedStyle(document.documentElement, null).width, 10) / document.documentElement.clientWidth;
			
			if (temp > 0)
			{
				zoom = temp;
			}
		}
		// This works well in IE8+ (unless your user has some freakish screen)
		else if (XXX_HTTP_Browser.browser == 'internetExplorer' && XXX_HTTP_Browser.version >= 8)
		{
			temp = window.screen.deviceXDPI / 96;
			
			if (temp > 0)
			{
				zoom = temp;
			}
		}
		else
		{
			// TODO firefox, IE <= 7, opera http://blog.sebastian-martens.de/2009/12/how-to-detect-the-browser-zoom-level-change-browser-zoo/
		}
		
		return zoom;
	},
	
	////////////////////
	// Selection
	////////////////////
	
	getSelectionText: function ()
	{
		var result = '';
		
		if (window.getSelection)
		{
			result = window.getSelection();
		}
		else if (document.selection)
		{
			result = document.selection.createRange().text;
		}
		
		return result;
	},
	
	////////////////////
	// Includes
	////////////////////
	
	resetCompletedCallback: function (element)
	{
		element._XXX_calledBack = false;
	},
	
	attachCompletedCallback: function (element, callback)
	{
		if (callback)
		{			
			XXX_DOM_NativeEventDispatcher.addEventListener(element, 'load', function (nativeEvent)
			{
				if (!this._XXX_calledBack)
				{
					this._XXX_calledBack = true;
					
					callback();
				}
			});
			XXX_DOM_NativeEventDispatcher.addEventListener(element, 'readystatechange', function (nativeEvent)
			{
				if (!this._XXX_calledBack)
				{
					if (this.readyState == 4 || this.readyState == 'load' || this.readyState == 'loaded' || this.readyState == 'complete' || this.readyState == 'completed')
					{
						this._XXX_calledBack = true;
						
						callback();
					}
				}
			});
		}
	},
	
	includeFile: function (uri, fileType, callback)
	{
		var fileElement = false;
				
		switch (fileType)
		{
			case 'js':
				fileElement = document.createElement('script');
				fileElement.setAttribute('type', 'text/javascript');
				fileElement.setAttribute('src', uri);
				break;
			case 'css':
				fileElement = document.createElement('link');
				fileElement.setAttribute('rel', 'stylesheet');
				fileElement.setAttribute('type', 'text/css');
				fileElement.setAttribute('href', uri);
				break;
		}
				
		if (callback)
		{
			this.attachCompletedCallback(fileElement, callback);
		}
		
		var head = this.documentBody.head;
		
		if (!head)
		{
			head = this.documentBody.childNodes[0];
		}
				
		if (fileElement !== false)
		{
			head.appendChild(fileElement);
		}
	},
	includeCSS: function (uri, callback)
	{
		this.includeFile(uri, 'css', callback);
	},
	includeJS: function (uri, callback)
	{
		this.includeFile(uri, 'js', callback);
	}
};

XXX_DOM_Ready.addEventListener(function ()
{
	XXX_HTTP_Browser_Page.initialize();
});