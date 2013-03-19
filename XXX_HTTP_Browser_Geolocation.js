var XXX_HTTP_Browser_Geolocation =
{
	supported: false,
	tested: false,
	
	data: {},
	
	latitude: 0,
	longitude: 0,
		
	initialize: function ()
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
				if (navigator.geolocation)
				{
					this.supported = true;
					
					result = true;
				}
				
				this.tested = true;
			}
		}
		
		return result;
	},
	
	getCoordinate: function (callback)
	{
		var result = false;
		
		if (this.supported)
		{
			
			if (XXX_HTTP_Browser_Geolocation.latitude != 0 || XXX_HTTP_Browser_Geolocation.longitude != 0)
			{
				result =
				{
					latitude: XXX_HTTP_Browser_Geolocation.latitude,
					longitude: XXX_HTTP_Browser_Geolocation.longitude
				};
			}
			
			if (navigator.geolocation)
			{
				var callbackWrapper = function (position)
				{
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					
					XXX_HTTP_Browser_Geolocation.latitude = latitude;
					XXX_HTTP_Browser_Geolocation.longitude = longitude;
					
					if (callback)
					{
						callback(latitude, longitude);
					}
				};
				
				navigator.geolocation.getCurrentPosition(callbackWrapper);
				
				result = true;
			}
		}
		
		return result;
	}
};

XXX_DOM_Ready.addEventListener(function ()
{
	XXX_HTTP_Browser_Geolocation.initialize();
});
