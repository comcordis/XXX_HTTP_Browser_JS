
var XXX_HTTP_Browser_NativeHelpers =
{
	CLASS_NAME: 'XXX_HTTP_Browser_NativeHelpers',
	
	////////////////////
	// Asynchronous Request Handler (XML HTTP, AJAX)
	////////////////////
		
	nativeAsynchronousRequestHandler:
	{
		includeCounter: 0,
		
		get: function (requireCORSSupport)
		{
			var type = null;
			
			var handler = null;
			
			var corsSupport = false;
			
			if (!handler && window.XMLHttpRequest)
			{
				try
				{
					handler = new XMLHttpRequest();	
					type = 'XMLHTTPRequest';
					
					/*
					if (handler.overrideMimeType)
					{
						handler.overrideMimeType('text/xml');	
					}
					*/
					
					// "withCredentials" only exists on XMLHTTPRequest2 objects.
					if ("withCredentials" in handler)
					{
						corsSupport = true;
					}
				}
				catch (e1)
				{
					handler = null;
				}
			}
			
			if (requireCORSSupport)
			{
				// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
				if (!handler && typeof XDomainRequest != "undefined")
				{
					handler = new XDomainRequest();
					
					type = 'XDomainRequest';
					
					corsSupport = true;
				}
				
				if (!handler)
				{
					handler = ++this.includeCounter;
					
					type = 'include';
					
					corsSupport = true;
				}
			}
			else
			{
				if (!handler && window.ActiveXObject)
				{
					var microsoftProgramIDs =
					[
						'MSXML3.XMLHTTP',
						'MSXML2.XMLHTTP.6.0',
						'MSXML2.XMLHTTP.5.0',
						'MSXML2.XMLHTTP.4.0',
						'MSXML2.XMLHTTP.3.0',
						'MSXML2.XMLHTTP',
						'Microsoft.XMLHTTP'
					];
					
					while (!handler && microsoftProgramIDs.length)
					{
						try
						{
							handler = new ActiveXObject(microsoftProgramIDs[0]);
							type = 'ActiveXObject';
						}
						catch (e2)
						{
							handler = null;
						}
						
						if (!handler)
						{
							microsoftProgramIDs.splice(0, 1);	
						}
					}
				}
				
				if (!handler)
				{
					handler = ++this.includeCounter;
					
					type = 'include';
					
					corsSupport = true;
				}
			}
			
			if (!handler)
			{
				if (XXX_JS.debug)
				{
					XXX_JS.errorNotification(1, 'Unable to create native asynchronous request handler', this.CLASS_NAME);
				}
				
				handler = false;
			}
			else
			{
			
				if (XXX_JS.debug)
				{
					XXX_JS.errorNotification(1, 'Created native asynchronous request handler of type: "' + type + '"', this.CLASS_NAME);
				}
				
				handler =
				{
					handler: handler,
					type: type,
					corsSupport: corsSupport
				};
			}
			
			return handler;
		},
		
		composeParameterString: function (variables)
		{
			var parameterString = '';
			
			if (XXX_Array.getFirstLevelItemTotal(variables) > 0)
			{
				for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(variables); i < iEnd; ++i)
				{
					var variable = variables[i];
					
					if (XXX_Type.isAssociativeArray(variable))
					{
						var key = variable.key;
						var value = variable.value;
						
						if (i > 0)
						{
							parameterString += '&';
						}
						
						if (XXX_Type.isNumericArray(value))
						{
							for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(value); j < jEnd; ++j)
							{
								var subValue = value[j];
								
								if (j > 0)
								{
									queryString += '&';
								}
								
								parameterString += key + '[]=' + XXX_String_Unicode.encodeURIValue(subValue);
							}
						}
						else
						{
							parameterString += key + '=' + XXX_String_Unicode.encodeURIValue(value);
						}					
					}
				}
			}
			
			return parameterString;
		},
		
		jsonpCompletedCallbacks: {},
		jsonpResponses: {},
		
		createCallbackForJSONP: function (includeIndex, completedCallback)
		{
			var tempCallbackName = 'callback_' + includeIndex;
			
			XXX_JS.errorNotification(1, 'Setting up callback for' + tempCallbackName);
				
			var proxyCompletedCallback = function (response)
			{
				XXX_JS.errorNotification(1, 'Response from ' + tempCallbackName);
				
				XXX_HTTP_Browser_NativeHelpers.nativeAsynchronousRequestHandler.jsonpResponses['response_' + includeIndex] = response;
				
				XXX_HTTP_Browser_Page.removeIncludeFile('include_' + includeIndex);
				
				completedCallback();
			};
			
			this.jsonpCompletedCallbacks[tempCallbackName] = proxyCompletedCallback;
			
			return 'XXX_HTTP_Browser_NativeHelpers.nativeAsynchronousRequestHandler.jsonpCompletedCallbacks.' + tempCallbackName;
		},
		
		sendRequest: function (nativeAsynchronousRequestHandler, uri, data, completedCallback, failedCallback, transportMethod, cacheable, crossDomain)
		{
			if (!cacheable)
			{
				var antiCacheSuffix = ((XXX_Number.getRandomFraction() * 10) + '_' + XXX_TimestampHelpers.getCurrentTimestamp());
				
				if (!XXX_Type.isString(data))
				{
					data.push({key: 'antiCacheSuffix', value: antiCacheSuffix});
				}
				else
				{
					data += '&antiCacheSuffix=' + XXX_String_Unicode.encodeURIValue(antiCacheSuffix);
				}
			}
			
			if (nativeAsynchronousRequestHandler.type == 'include')
			{
				transportMethod = 'uri';
				
				var jsonpCallback = this.createCallbackForJSONP(nativeAsynchronousRequestHandler.handler, completedCallback);
				
				if (!XXX_Type.isString(data))
				{
					data.push({key: 'callback', value: jsonpCallback});
				}
				else
				{
					if (data == '')
					{
						data += 'callback=' + jsonpCallback;
					}
					else
					{
						data += '&callback=' + jsonpCallback;
					}
				}
			}
		
			if (!XXX_Type.isString(data))
			{
				data = this.composeParameterString(data);
			}
					
			transportMethod = XXX_Default.toOption(transportMethod, ['uri', 'body'], 'body');
			
			var dataLength = XXX_String.getCharacterLength(data);
			
			if (transportMethod == 'uri')
			{
				if (XXX_String.findFirstPosition(uri, '?') === false)
				{
					uri += '?' + data;
				}
				else
				{
					uri += '&' + data;
				}
				
				dataLength = 0;
				data = null;
			}
			
			try
			{
				if (nativeAsynchronousRequestHandler.type == 'include')
				{
					XXX_HTTP_Browser_Page.includeJS(uri, false, 'include_' + nativeAsynchronousRequestHandler.handler);
				}
				else
				{
					// Open
						
						var nativeTransportMethod = (transportMethod == 'body' ? 'POST' : 'GET');
						
						switch (nativeAsynchronousRequestHandler.type)
						{
							case 'XMLHTTPRequest':
								nativeAsynchronousRequestHandler.handler.open(nativeTransportMethod, uri, true);
								break;
							case 'ActiveXObject':
							case 'XDomainRequest':
							default:
								nativeAsynchronousRequestHandler.handler.open(nativeTransportMethod, uri);
								break;
						}
						
			
					// State change handlers
					
						var XXX_nativeAsynchronousRequestHandler = nativeAsynchronousRequestHandler.handler;
						var XXX_completedCallback = completedCallback;
						var XXX_failedCallback = failedCallback;
						
						var stateChangeHandler = function ()
						{
							if (!(XXX_nativeAsynchronousRequestHandler.readyState === 4 || XXX_nativeAsynchronousRequestHandler.readyState === 'complete' || XXX_nativeAsynchronousRequestHandler.readyState === 'loaded'))
							{
								return;
							}
							
							// Completed
							if (XXX_nativeAsynchronousRequestHandler.status >= 200 || XXX_nativeAsynchronousRequestHandler.status <= 299)
							{
								XXX_completedCallback();
							}
							// Error
							else
							{
								XXX_failedCallback();
							}
						};
						
						nativeAsynchronousRequestHandler.handler.onreadystatechange = stateChangeHandler;
					
					// Headers
						
						// Request
						nativeAsynchronousRequestHandler.handler.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');			
						nativeAsynchronousRequestHandler.handler.setRequestHeader('Content-length', dataLength);
						nativeAsynchronousRequestHandler.handler.setRequestHeader('Origin', XXX_String.getPart(XXX_URI.currentURIPathPrefix, 0, -1));
						
						if (!cacheable)
						{
							// Cache
							nativeAsynchronousRequestHandler.handler.setRequestHeader('Cache-Control', 'no-cache');
							nativeAsynchronousRequestHandler.handler.setRequestHeader('Pragma', 'no-cache');
				        	nativeAsynchronousRequestHandler.handler.setRequestHeader("If-Modified-Since", "Mon, 26 Jul 1997 05:00:00 GMT");
			        	}
			        	
						// Response
						nativeAsynchronousRequestHandler.handler.setRequestHeader('Accept-Language', 'en-US');
						nativeAsynchronousRequestHandler.handler.setRequestHeader('Accept-Charset', 'utf-8');
						nativeAsynchronousRequestHandler.handler.setRequestHeader('Accept', 'text/plain, text/html, text/xml, text/javascript, text/json, text/css, */*');
						
						nativeAsynchronousRequestHandler.handler.setRequestHeader('Connection', 'close');
					
					// Send
						
						nativeAsynchronousRequestHandler.handler.send(data);
				}
		
			}
			catch (exception)
			{
				failedCallback();
			}
		},
				
		cancelRequest: function (nativeAsynchronousRequestHandler)
		{
			if (nativeAsynchronousRequestHandler.type == 'include')
			{
				XXX_HTTP_Browser_Page.removeIncludeFile('include_' + nativeAsynchronousRequestHandler.handler);
			}
			else
			{
				nativeAsynchronousRequestHandler.handler.abort();
			}
		},
		
		getResponse: function (nativeAsynchronousRequestHandler)
		{
			var responseText = '';
			var responseXML = '';
			
			if (nativeAsynchronousRequestHandler.type == 'include')
			{
				if (this.jsonpResponses['response_' + nativeAsynchronousRequestHandler.handler])
				{
					responseText = this.jsonpResponses['response_' + nativeAsynchronousRequestHandler.handler];
					responseXML = responseText;
				}
			}
			else
			{
				responseText = nativeAsynchronousRequestHandler.handler.responseText;
				responseXML = nativeAsynchronousRequestHandler.handler.responseXML;
			}
			
			var result =
			{
				text: responseText,
				xml: responseXML
			};
			
			return result;
		}
	}
};