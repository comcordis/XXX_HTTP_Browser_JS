var XXX_HTTP_Browser_ViewPort =
{
	scrollBarSize: false,
	
	get: function ()
	{
		var position = this.getPosition();
		var size = this.getSize();
		
		var result =
		{
			x: position.x,
			y: position.y,
			width: size.width,
			height: size.height
		};
		
		return result;
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
		
		if ((window.innerWidth || window.innerWidth === 0) || (window.innerHeight || window.innerHeight === 0))
		{
			result =
			{
				width: window.innerWidth,
				height: window.innerHeight
			};
		}
		else
		{
			var documentBody = XXX_HTTP_Browser_Page.getDocumentBody();
			
			if ((documentBody.clientWidth || documentBody.clientWidth === 0) || (documentBody.clientHeight || documentBody.clientHeight === 0))
			{
				result =
				{
					width: documentBody.clientWidth,
					height: documentBody.clientHeight
				};
			}
		}
				
		return result;
	},
	
	
	////////////////////
	// Position (scroll)
	////////////////////
	
	getPosition: function ()
	{
		var result =
		{
			x: 0,
			y: 0
		};
		
		if ((window.pageXOffset || window.pageXOffset === 0) || (window.pageYOffset || window.pageYOffset === 0))
		{
			result =
			{
				x: window.pageXOffset,
				y: window.pageYOffset
			};
		}
		else
		{
			var documentBody = XXX_HTTP_Browser_Page.getDocumentBody();
			
			if ((documentBody.scrollLeft || documentBody.scrollLeft === 0) || (documentBody.scrollTop || documentBody.scrollTop === 0))
			{
				result =
				{
					x: documentBody.scrollLeft,
					y: documentBody.scrollTop
				};
			}
		}
		
		return result;
	},
	
	setPosition: function (x, y)
	{
		if (window.scrollTo)
		{
			window.scrollTo(x, y);
		}
		else
		{
			if ((window.pageXOffset || window.pageXOffset === 0) || (window.pageYOffset || window.pageYOffset === 0))
			{
				window.pageXOffset = x;
				window.pageYOffset = y;
			}
			else
			{
				var documentBody = XXX_HTTP_Browser_Page.getDocumentBody();
			
				if ((documentBody.scrollLeft || documentBody.scrollLeft === 0) || (documentBody.scrollTop || documentBody.scrollTop === 0))
				{
					documentBody.scrollLeft = x;
					documentBody.scrollTop = y;
				}
			}
		}
	},
	
	
	////////////////////
	// Scroll bar
	////////////////////
	
	getDefaultScrollBarSize: function ()
	{
		var result = false;
		
		if (this.scrollBarSize)
		{
			result = this.scrollBarSize;	
		}
		else
		{
			// Disable scroll bars in body
			document.body.style.overflow = 'hidden';
			var scrollBarSize = document.body.clientWidth;
			
			// Enable scroll bars
			document.body.style.overflow = 'scroll';
			scrollBarSize -= document.body.clientWidth;
			
			// IE in Standard mode
			if(!scrollBarSize)
			{
				scrollBarSize = document.body.offsetWidth - document.body.clientWidth;
			}
		
			// Original settings
			document.body.style.overflow = '';
			
			result = scrollBarSize;
			
			this.scrollBarSize = result;
		}
		
		return result;
	},
	
	hasHorizontalScroll: function ()
	{
		var pageSize = XXX_HTTP_Browser_Page.getSize();
		var viewPortSize = this.getSize();
		
		var result = false;
		
		if (pageSize.width != viewPortSize.width)
		{
			result = true;
		}
		
		return result;
	},
	
	hasVerticalScroll: function ()
	{
		var pageSize = XXX_HTTP_Browser_Page.getSize();
		var viewPortSize = this.getSize();
		
		var result = false;
		
		if (pageSize.height != viewPortSize.height)
		{
			result = true;
		}
		
		return result;
	}
};