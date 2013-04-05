
var XXX_HTTP_Browser_NativeHelpers =
{
	CLASS_NAME: 'XXX_HTTP_Browser_NativeHelpers',
	
	////////////////////
	// Asynchronous Request Handler (XML HTTP, AJAX)
	////////////////////
	
	nativeAsynchronousRequestHandler:
	{
		get: function ()
		{
			var type = null;
			
			var handler = null;
			
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
				}
				catch (e1)
				{
					handler = null;
				}
			}
			
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
				XXX_JS.errorNotification(1, 'Unable to create native asynchronous request handler', this.CLASS_NAME);
				
				handler = false;
			}
			else
			{
			
				XXX_JS.errorNotification(1, 'Created native asynchronous request handler of type: "' + type + '"', this.CLASS_NAME);
				
				handler =
				{
					nativeAsynchronousRequestHandler: handler,
					type: type
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
		
		sendRequest: function (nativeAsynchronousRequestHandler, uri, data, completedCallback, failedCallback, transportMethod, cacheable)
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
				// Open
				
					nativeAsynchronousRequestHandler.open((transportMethod == 'body' ? 'POST' : 'GET'), uri, true);
		
				// State change handlers
				
					var XXX_nativeAsynchronousRequestHandler = nativeAsynchronousRequestHandler;
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
					
					nativeAsynchronousRequestHandler.onreadystatechange = stateChangeHandler;
				
				// Headers
					
					// Request
					nativeAsynchronousRequestHandler.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');			
					nativeAsynchronousRequestHandler.setRequestHeader('Content-length', dataLength);
					
					if (!cacheable)
					{
						// Cache
						nativeAsynchronousRequestHandler.setRequestHeader('Cache-Control', 'no-cache');
						nativeAsynchronousRequestHandler.setRequestHeader('Pragma', 'no-cache');
			        	nativeAsynchronousRequestHandler.setRequestHeader("If-Modified-Since", "Mon, 26 Jul 1997 05:00:00 GMT");
		        	}
		        	
					// Response
					nativeAsynchronousRequestHandler.setRequestHeader('Accept-Language', 'en-US');
					nativeAsynchronousRequestHandler.setRequestHeader('Accept-Charset', 'utf-8');
					nativeAsynchronousRequestHandler.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml, text/xml, text/javascript, text/css, */*');
					
					nativeAsynchronousRequestHandler.setRequestHeader('Connection', 'close');
				
				// Send
					
					nativeAsynchronousRequestHandler.send(data);
		
		
			}
			catch (exception)
			{
				failedCallback();
			}
		},
				
		cancelRequest: function (nativeAsynchronousRequestHandler)
		{
			nativeAsynchronousRequestHandler.abort();
		},
		
		getResponse: function (nativeAsynchronousRequestHandler)
		{
			var responseText = nativeAsynchronousRequestHandler.responseText;
			var responseXML = nativeAsynchronousRequestHandler.responseXML;
			
			var result =
			{
				text: responseText,
				xml: responseXML
			};
			
			return result;
		}
	}
};