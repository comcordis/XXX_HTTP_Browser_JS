// http://www.quirksmode.org/js/detect.html

var XXX_HTTP_Browser =
{
	CLASS_NAME: 'XXX_HTTP_Browser',
	
	browser: '',
	version: '',
	platform: '',
	renderMode: false,

	languages: [],
	firstLanguage:
	{
		languageCode: 'en',
		languageString: 'en'
	},
	firstNonEnglishLanguage:
	{
		languageCode: 'en',
		languageString: 'en'
	},
	
	engine: '',
	userAgentString: '',
	pointerInterface: 'mouse',
	touchInterface: false,
	screenRotation: false,
		
	initialize: function ()
	{
		var browserSignatures =
		[
			{
				string: navigator.userAgent,
				subString: 'Chrome',
				identity: 'chrome'
			},
			{
				string: navigator.userAgent,
				subString: 'Android',
				identity: 'chrome'
			},
			{ 	string: navigator.userAgent,
				subString: 'OmniWeb',
				versionSearch: 'OmniWeb/',
				identity: 'omniWeb'
			},
			{
				string: navigator.vendor,
				subString: 'Apple',
				versionSearch: 'Version',
				identity: 'safari'
			},
			{
				property: window.opera,
				identity: 'opera'
			},
			{
				string: navigator.vendor,
				subString: 'iCab',
				identity: 'iCab'
			},
			{
				string: navigator.vendor,
				subString: 'KDE',
				identity: 'konqueror'
			},
			{
				string: navigator.userAgent,
				subString: 'Firefox',
				identity: 'fireFox'
			},
			{
				string: navigator.vendor,
				subString: 'Camino',
				identity: 'Camino'
			},
			// for newer Netscapes (6+)
			{
				string: navigator.userAgent,
				subString: 'Netscape',
				identity: 'netscape'
			},
			{
				string: navigator.userAgent,
				subString: 'MSIE',
				versionSearch: 'MSIE',
				identity: 'internet Explorer'
			},
			{
				string: navigator.userAgent,
				subString: 'Gecko',
				versionSearch: 'rv',			
				identity: 'mozilla'
			},
			// for older Netscapes (4-)
			{
				string: navigator.userAgent,
				subString: 'Mozilla',
				versionSearch: 'Mozilla',			
				identity: 'netscape'
			}
		];
		
		var platformSignatures =
		[
			{
				string: navigator.platform,
				subString: 'Win',
				identity: 'windows'
			},
			{
				string: navigator.platform,
				subString: 'Mac',
				identity: 'mac'
			},
			{
			   string: navigator.userAgent,
			   subString: 'iPhone',
			   identity: 'iOS'
		    },
			{
			   string: navigator.userAgent,
			   subString: 'iPad',
			   identity: 'iOS'
		    },
			{
			   string: navigator.userAgent,
			   subString: 'iPod',
			   identity: 'iOS'
		    },
			{
			   string: navigator.userAgent,
			   subString: 'Android',
			   identity: 'android'
		    },
			{
				string: navigator.platform,
				subString: 'Linux',
				identity: 'linux'
			}
		];
		
	
		this.browser = this.searchString(browserSignatures) || '';
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion)	|| '';
		this.platform = this.searchString(platformSignatures) || '';
		this.renderMode = this.deriveRenderMode();
		
		// Language
		
		if (navigator.language)
		{
			this.languages.push(this.parseLanguageCode(navigator.language));
		}
		
		if (navigator.userLanguage)
		{
			this.languages.push(this.parseLanguageCode(navigator.userLanguage));
		}
		
		if (navigator.browserLanguage)
		{
			this.languages.push(this.parseLanguageCode(navigator.browserLanguage));
		}
		
		if (navigator.systemLanguage)
		{
			this.languages.push(this.parseLanguageCode(navigator.systemLanguage));
		}
		
		if (navigator.platformLanguage)
		{
			this.languages.push(this.parseLanguageCode(navigator.platformLanguage));
		}
		
		// Find first non-english languageCode
		if (XXX_Array.getFirstLevelItemTotal(this.languages) > 0)
		{
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(this.languages); i < iEnd; ++i)
			{
				var language = this.languages[i];
				
				if (language.languageCode != 'en')
				{
					this.firstNonEnglishLanguage = language;
					
					break;
				}
			}
		}
		
		this.firstLanguage = this.languages[0];
				
		if (this.browser == 'fireFox' || this.browser == 'camino' || this.browser == 'netscape')
		{
			this.engine = 'gecko';
		}
		else if (this.browser == 'safari' || this.browser == 'chrome')
		{
			this.engine = 'webkit';
		}
		else if (this.browser == 'internetExplorer')
		{
			this.engine = 'trident';
		}
		else if (this.browser == 'konqueror')
		{
			this.engine = 'khtml';
		}
		else if (this.browser == 'opera')
		{
			this.engine = 'presto';
		}
		
		this.userAgentString = navigator.userAgent;
		
		
		// http://modernizr.github.com/Modernizr/touch.html
		
		var testElement = document.createElement('div');
		testElement.setAttribute('ontouchmove', 'return;');
		
		if (typeof testElement.ontouchmove == 'function')
		{
			this.pointerInterface = 'touch';
			this.touchInterface = true;
		}
		
		if ("onorientationchange" in window)
		{
			this.screenRotation = true;
		}
	},
	
	deriveRenderMode: function ()
	{
		var browserMode = document.compatMode;
		var modeName;
		
		if (browserMode)
		{
			if (browserMode == 'BackCompat')
			{
				modeName = 'quirks';
			}
			else if (browserMode == 'CSS1Compat' || browserMode == 'CSS2Compat')
			{
				modeName = 'standardsCompliance';
			}
			else
			{
				modeName = 'almostStandardsCompliance';
			}
		}
		
		return modeName;
	},
		
	parseLanguageCode: function (string)
	{
		string = string.toLowerCase();
		
		var result = {};
		
		var tempParts = string.split('-');
		
		if (tempParts.length == 2)
		{
			result.languageCode = tempParts[0];
			result.dialectCode = tempParts[1];
			result.languageString = string;
		}
		else if (tempParts.length == 1)
		{
			result.languageCode = tempParts[0];
			result.languageString = string;
		}
		
		return result;
	},
	
	searchString: function (data)
	{
		for (var i = 0; i < data.length; ++i)
		{
			var dataString = data[i].string;
			var dataProperty = data[i].property;
			
			this.versionSearchString = (data[i].versionSearch || data[i].identity);
			this.versionSearchString = this.versionSearchString.toLowerCase();
			
			if (dataString)
			{
				var dataString = dataString.toLowerCase();
				var subString = data[i].subString.toLowerCase();
				
				if (dataString.indexOf(subString) != -1)
				{
					return data[i].identity;
				}
			}
			else if (dataProperty)
			{
				return data[i].identity;
			}
		}
	},
	
	searchVersion: function (dataString)
	{
		var index = dataString.indexOf(this.versionSearchString);
		
		if (index == -1)
		{
			return;
		}
		
		return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
	},
			
	////////////////////
	// Bookmark
	////////////////////
	
	bookmark: function (uri, title)
	{
		if (document.all)
		{
			window.external.AddFavorite(uri, title);
		}
		else if (window.sidebar)
		{
			window.sidebar.addPanel(title, uri, '');
		}
	},
	
	////////////////////
	// Confirm
	////////////////////
	
	confirm: function (question)
	{
		return confirm(question) ? true : false;
	},
	
	enableUnloadConfirmation: function (message)
	{
		window.onbeforeunload = function ()
		{
			return message;
		};
	},
	
	disableUnloadConfirmation: function ()
	{
		window.onbeforeunload = true;
	},
	
	////////////////////
	// Printing
	////////////////////
	
	// For alternative version use the link element
	// <link rel="alternate" media="print" href="printVersion.ext">

	print: function ()
	{
		if (window.print)
		{
			window.print();  
		}
		else
		{
			/*
			var WebBrowser = '<OBJECT ID="WebBrowser1" WIDTH="0" HEIGHT="0" CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT>';
			document.body.insertAdjacentHTML('beforeEnd', WebBrowser);
			WebBrowser1.ExecWB(6, 2); // Use a 1 vs. a 2 for a prompting dialog server    WebBrowser1.outerHTML = "";
			*/
		}
	},
	
	////////////////////
	// Pop-up
	////////////////////
	
	popUpSupported: false,
	popUpTested: false,
	
	isPopUpSupported: function ()
	{
		var result = false;
		
		if (!this.popUpTested)
		{
			result = this.testPopUpSupport();
		}
		else
		{
			result = this.popUpSupported;
		}
		
		return result;
	},
	
	testPopUpSupport: function ()
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
				result = true;
				
				// PopUp
				try
				{
					var popUpWindow = window.open('', '', 'width=1,height=1,left=0,top=0,scrollbars=no');
					
					if(popUpWindow)
					{
						popUpWindow.close();
					}
					else
					{
						result = false;	
					}
				}
				catch (nativeException)
				{
					result = false;
				}
				
				this.tested = true;
				this.popUpSupported = result;
			}
		}
		
		return result;
	},
	
	openPopUp: function (uri, windowName, desiredWidth, desiredHeight, position, scrollBars, locationBar, directoryBar, statusBar, menuBar, toolBar, resizable)
	{
		scrollBars = (scrollBars) ? 'yes' : 'no';
		locationBar = (locationBar) ? 'yes' : 'no';
		directoryBar = (directoryBar) ? 'yes' : 'no';
		statusBar = (statusBar) ? 'yes' : 'no';
		menuBar = (menuBar) ? 'yes' : 'no';
		toolBar = (toolBar) ? 'yes' : 'no';
		resizable = (resizable) ? 'yes' : 'no';
		
		var leftPosition;
		var topPosition;
		
		if (XXX_Type.isEmpty(position))
		{
			position = 1;	
		}
		
		// Random
		if (position === 0)
		{
			leftPosition = (screen.width) ? XXX_Number.floor(XXX_Number.getRandom() * (screen.width - desiredWidth)) : 100;
			topPosition = (screen.height) ? XXX_Number.floor(XXX_Number.getRandom() * ((screen.height - desiredHeight) - 75)) : 100;
		}
		// Center
		else if (position == 1)
		{
			leftPosition = (screen.width) ? (screen.width-desiredWidth) / 2 : 100;
			topPosition = (screen.height) ? (screen.height-desiredHeight) / 2 : 100;
		}
		// Top
		else if (position == 2)
		{
			leftPosition = 0;
			topPosition = 20;
		}
		
		var settings = 'width=' + desiredWidth + ', height=' + desiredHeight + ', top=' + topPosition + ', left=' + leftPosition+', scrollbars=' + scrollBars + ', location=' + locationBar + ', directories=' + directoryBar + ', status=' + statusBar + ', menubar=' + menuBar + ', toolbar=' + toolBar + ', resizable=' + resizable;
		
		window.open(uri, windowName, settings);
	}
};

XXX_DOM_Ready.addEventListener(function ()
{
	XXX_HTTP_Browser.initialize();
});
