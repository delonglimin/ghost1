var Nconf = require('nconf'),
    path = require('path'),
    _debug = require('ghost-ignition').debug._base,
    debug = _debug('ghost:config'),
    localUtils = require('./utils'),
    env = process.env.NODE_ENV || 'development',
    _private = {};

_private.loadNconf = function loadNconf(options) {
    debug('config start');
    options = options || {};

    var baseConfigPath = options.baseConfigPath || __dirname,
        customConfigPath = options.customConfigPath || process.cwd(),
        nconf = new Nconf.Provider();

    /**
     * no channel can override the overrides
     */
   // nconf.file('overrides', path.join(baseConfigPath, 'overrides.json'));
nconf.overrides({
    "paths": {
        "appRoot": ".",
        "corePath": "core/",
        "clientAssets": "core/built/assets",
        "helperTemplates": "core/frontend/helpers/tpl/",
        "adminViews": "core/server/web/admin/views/",
        "defaultViews": "core/server/views/",
        "defaultSettings": "core/frontend/services/settings/",
        "internalAppPath": "core/frontend/apps/",
        "internalStoragePath": "core/server/adapters/storage/",
        "internalSchedulingPath": "core/server/adapters/scheduling/",
        "migrationPath": "core/server/data/migrations",
        "publicFilePath": "core/server/public"
    },
    "apps": {
        "internal": [
            "private-blogging",
            "subscribers",
            "amp"
        ]
    },
    "slugs": {
        "reserved": ["admin", "app", "apps", "categories",
            "category", "dashboard", "feed", "ghost-admin", "login", "logout",
            "page", "pages", "post", "posts", "public", "register", "setup",
            "signin", "signout", "signup", "user", "users", "wp-admin", "wp-login"],
        "protected": ["ghost", "rss", "amp"]
    },
    "uploads": {
        "subscribers": {
            "extensions": [".csv"],
            "contentTypes": ["text/csv", "application/csv", "application/octet-stream"]
        },
        "images": {
            "extensions": [".jpg", ".jpeg", ".gif", ".png", ".svg", ".svgz", ".ico"],
            "contentTypes": ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"]
        },
        "icons": {
            "extensions": [".png", ".ico"],
            "contentTypes": ["image/png", "image/x-icon", "image/vnd.microsoft.icon"]
        },
        "db": {
            "extensions": [".json", ".zip"],
            "contentTypes": ["text/plain", "application/octet-stream", "application/json", "application/zip", "application/x-zip-compressed"]
        },
        "themes": {
            "extensions": [".zip"],
            "contentTypes": ["application/zip", "application/x-zip-compressed", "application/octet-stream"]
        },
        "redirects": {
            "extensions": [".json"],
            "contentTypes": ["text/plain", "application/octet-stream", "application/json"]
        },
        "routes": {
            "extensions": [".yaml"],
            "contentTypes": ["text/plain", "text/yaml", "application/octet-stream", "application/yaml", "application/x-yaml"]
        }
    },
    "times": {
        "cannotScheduleAPostBeforeInMinutes": 2,
        "publishAPostBySchedulerToleranceInMinutes": 2,
        "getImageSizeTimeoutInMS": 5000
    },
    "maintenance": {
        "enabled": false
    },
    "api": {
        "versions": {
            "all": ["v0.1", "v2", "canary"],
            "canary": {
                "admin": "canary/admin",
                "content": "canary/content",
                "members": "canary/members"
            },
            "v2": {
                "admin": "v2/admin",
                "content": "v2/content",
                "members": "v2/members"
            },
            "v0.1": {
                "admin": "v0.1",
                "content": "v0.1"
            }
        }
    }
}
);

    /**
     * command line arguments
     */
    nconf.argv();

    /**
     * env arguments
     */
    nconf.env({
        separator: '__',
        parseValues: true
    });

    //nconf.file('custom-env', path.join(customConfigPath, 'config.' + env + '.json'));
    //nconf.file('default-env', 'config.produnction.json');
    //nconf.file('defaults', path.join(baseConfigPath, 'defaults.json'));
    


    nconf.add('defaults', { type: 'literal', store:{
    "url": "http://localhost:2368",
    "server": {
        "host": "127.0.0.1",
        "port": 2368
    },
    "updateCheck": {
        "url": "https://updates.ghost.org",
        "forceUpdate": false
    },
    "privacy": false,
    "useMinFiles": true,
    "paths": {
        "contentPath": "content/"
    },
    "storage": {
        "active": "LocalFileStorage"
    },
    "scheduling": {
        "active": "SchedulingDefault"
    },
    "members": {
        "contentApiAccess": [],
        "paymentProcessors": []
    },
    "logging": {
        "level": "info",
        "rotation": {
            "enabled": false,
            "period": "1d",
            "count": 10
        },
        "transports": ["stdout"],
        "slowHelper": {
            "level": "warn",
            "threshold": 200
        }
    },
    "spam": {
        "user_login": {
            "minWait": 600000,
            "maxWait": 604800000,
            "freeRetries": 4
        },
        "user_reset": {
            "minWait": 3600000,
            "maxWait": 3600000,
            "lifetime": 3600,
            "freeRetries": 4
        },
        "global_reset": {
            "minWait": 3600000,
            "maxWait": 3600000,
            "lifetime": 3600,
            "freeRetries":4
        },
        "global_block": {
            "minWait": 3600000,
            "maxWait": 3600000,
            "lifetime": 3600,
            "freeRetries":99
        },
        "private_block": {
            "minWait": 3600000,
            "maxWait": 3600000,
            "lifetime": 3600,
            "freeRetries":99
        },
        "content_api_key": {
            "minWait": 3600000,
            "maxWait": 86400000,
            "lifetime": 3600,
            "freeRetries": 99
        }
    },
    "caching": {
        "frontend": {
            "maxAge": 0
        },
        "301": {
            "maxAge": 31536000
        },
        "customRedirects": {
            "maxAge": 31536000
        },
        "favicon": {
            "maxAge": 86400
        },
        "sitemap": {
            "maxAge": 3600
        },
        "robotstxt": {
            "maxAge": 3600000
        }
    },
    "imageOptimization": {
        "resize": true
    },
    "compress": true,
    "preloadHeaders": false,
    "adminFrameProtection": true,
    "sendWelcomeEmail": true
}

    });

    nconf.add('default-env', { type: 'literal', store:{
      "url": "http://localhost:2368",
      "database": {
          "client": "sqlite3",
          "connection": {
              "filename": "content/data/ghost-dev.db"
          },
          "debug": false
      },
      "paths": {
          "contentPath": "content/"
      },
      "privacy": {
          "useRpcPing": false,
          "useUpdateCheck": true
      },
      "useMinFiles": false,
      "caching": {
          "theme": {
              "maxAge": 0
          },
          "admin": {
              "maxAge": 0
          }
      }
    }
    });


    
    
    /**
     * transform all relative paths to absolute paths
     * transform sqlite filename path for Ghost-CLI
     */
    nconf.makePathsAbsolute = localUtils.makePathsAbsolute.bind(nconf);
    nconf.isPrivacyDisabled = localUtils.isPrivacyDisabled.bind(nconf);
    nconf.getContentPath = localUtils.getContentPath.bind(nconf);
    nconf.sanitizeDatabaseProperties = localUtils.sanitizeDatabaseProperties.bind(nconf);
    nconf.doesContentPathExist = localUtils.doesContentPathExist.bind(nconf);

    nconf.sanitizeDatabaseProperties();
    nconf.makePathsAbsolute(nconf.get('paths'), 'paths');
    if (nconf.get('database:client') === 'sqlite3') {
        nconf.makePathsAbsolute(nconf.get('database:connection'), 'database:connection');
    }
    /**
     * Check if the URL in config has a protocol
     */
    nconf.checkUrlProtocol = localUtils.checkUrlProtocol.bind(nconf);
    nconf.checkUrlProtocol();

    /**
     * Ensure that the content path exists
     */
    nconf.doesContentPathExist();

    /**
     * values we have to set manual
     */
    nconf.set('env', env);

    // Wrap this in a check, because else nconf.get() is executed unnecessarily
    // To output this, use DEBUG=ghost:*,ghost-config
    if (_debug.enabled('ghost-config')) {
        debug(nconf.get());
    }

    debug('config end');
    return nconf;
};

module.exports = _private.loadNconf();
module.exports.loadNconf = _private.loadNconf;
