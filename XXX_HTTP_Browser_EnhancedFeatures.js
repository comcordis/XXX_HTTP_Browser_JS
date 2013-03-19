// http://www.filamentgroup.com/dwpe/

var XXX_HTTP_Browser_EnhancedFeatures =
{
	supported: false,
	tested: false,
		
	isSupported: function ()
	{
		var result = false;
		
		if (!this.tested)
		{
			result = this.testSupport();
		}
		else
		{
			result = this.supported;
		}
		
		return result;
	},
	
	testSupport: function ()
	{
		var result = false;
				
		if (this.supported)
		{
			result = true;	
		}
		else
		{
			if (!this.tested)
			{
				var failedReason = false;
				
				try
				{
					// Object detection (DOM)
					if (document.getElementById && document.createElement && document.body)
					{
						result = true;
						
						// DOM creation				
						var newDiv = document.createElement('div');
						document.body.appendChild(newDiv);
						
						newDiv.style.visibility = 'hidden';
						newDiv.style.display = 'block';
										
						// Box model
						newDiv.style.width = '20px';
						newDiv.style.padding = '10px';
						
						var divWidth = newDiv.offsetWidth;
						
						if (divWidth != 40)
						{
							result = false;
							
							failedReason = 'offsetWidth';
						}
						
						// Positioning
						newDiv.style.position = 'absolute';
						newDiv.style.left = '10px';
						var leftVal = newDiv.offsetLeft;
						if (leftVal != 10)
						{
							result = false;
							
							failedReason = 'offsetLeft';
						}
						
						// Float
						var newInnerDiv = document.createElement('div');
						
						newInnerDiv.style.width = '5px';
						newInnerDiv.style.cssFloat = 'left';
						newInnerDiv.style.styleFloat = 'left';
						
						newDiv.appendChild(newInnerDiv);
						
						var secondInnerDiv = newInnerDiv.cloneNode(true); 
						newDiv.appendChild(secondInnerDiv);
						
						var newInnerDivTop = newInnerDiv.offsetTop;
						var secondInnerDivTop = secondInnerDiv.offsetTop;
						
						if (newInnerDivTop != secondInnerDivTop)
						{
							result = false;
							
							failedReason = 'float';
						}
						
						// InnerHTML creation
						
						// Clear
						newDiv.innerHTML = '<ul><li style="width: 5px; float: left;">test</li><li style="width: 5px; float: left; clear: left;">test</li></ul>';
						
						var top1 = newDiv.getElementsByTagName('li')[0].offsetTop;
						var top2 = newDiv.getElementsByTagName('li')[1].offsetTop;
						
						if (top1 == top2)
						{
							result = false;
							
							failedReason = 'clear';
						}
						
						var newDivHeight = 0;
						
						// Overflow
						newDiv.innerHTML = '<div style="height: 20px;"></div>';
						
						newDiv.style.padding = '0';
						newDiv.style.height = '10px';
						newDiv.style.overflow = 'auto';
						
						newDivHeight = newDiv.offsetHeight;
						
						if (newDivHeight != 10)
						{
							result = false;
							
							failedReason = 'overflow';
						}
						
						// Line-height (including unitless)
						newDiv.innerHTML = '<div style="line-height: 2; font-size: 10px;">Te<br>st</div>';
						
						newDiv.style.padding = '0';
						newDiv.style.height = 'auto';
						newDiv.style.overflow = '';
						
						newDivHeight = newDiv.offsetHeight;
						
						if (newDivHeight > 40)
						{
							result = false;
							
							failedReason = 'line height';
						}
						
						// Canvas or Filter
						var canvas = document.createElement('canvas');
								
						if (!canvas.getContext)
						{
							if (!(newDiv.style.filter || newDiv.filters))
							{
								result = false;	
							
								failedReason = 'canvas or filter';
							}
						}
						
						// Selection
						var selectionSupport = false;
						
						var textInput = document.createElement('textarea');
						document.body.appendChild(textInput);
						
						if (textInput.setSelectionRange)
						{
							selectionSupport = true;
						}
						else if (document.selection)
						{
							selectionSupport = true;
						}
						
						if (!selectionSupport)
						{
							result = false;	
							
							failedReason = 'selection';
						}
										
						document.body.removeChild(textInput);
										
						// Regular Expressions
						if (!window.RegExp)
						{
							result = false;	
														
							failedReason = 'regular expressions';
						}
						
						// Frames
						if (!window.frames)
						{
							result = false;
							
							failedReason = 'frames';
						}
						
						// Images
						if (!document.images)
						{
							result = false;	
							
							failedReason = 'images';
						}
						
						// Forms
						if (!document.forms)
						{
							result = false;
							
							failedReason = 'forms';
						}
						
						// Window resize
						if (window.onresize === false)
						{
							result = false;
							
							failedReason = 'window resize';
						}
						/*
						// Printing
						if (!window.print)
						{
							result = false;
							
							failedReason = 'print';
						}
						*/
												
						// Additional object detection
						if (window.clientInformation && window.opera)
						{
							result = false;
							
							failedReason = 'additional object detection';
						}
						
						document.body.removeChild(newDiv);
					}
					else
					{
						result = false;
						
						failedReason = 'object detection';
					}
				}
				catch (nativeException)
				{
				}
				
				if (!result)
				{
					//alert(failedReason);
				}
				
				this.supported = result;
				
				this.tested = true;
			}
		}
						
		return result;
	}
};

XXX_DOM_Ready.addEventListener(function ()
{
	XXX_HTTP_Browser_EnhancedFeatures.testSupport();
});