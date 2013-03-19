var XXX_HTTPServer_Client =
{
	CLASS_NAME: 'XXX_HTTPServer_Client',
	
	ip: '',
	
	encryptedConnection: false,
	
	uri: '',
	referrerURI: '',
	
	initialize: function ()
	{
		this.uri = location.href;
		
		this.referrerURI = document.referrer ? document.referrer : (document.referer ? document.referer : false);
	},
	
	////////////////////
	// URI
	////////////////////
	
	setURI: function (uri, historyRecord)
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
	}
};