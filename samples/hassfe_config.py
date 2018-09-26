DOMAIN = "hassfe_config"

def setup(hass, config):
    """Setup the hassfe_config component."""
    # States are in the format DOMAIN.OBJECT_ID.
    hass.states.set('hassfe_config.config', '{"gistToken": "GIST TOKEN", "gistUser" :"GITHUB USERNAME", "gistPassword" : "GITHUB PASSWORD"}')

    # Return boolean to indicate that initialization was successfully.
    return True
