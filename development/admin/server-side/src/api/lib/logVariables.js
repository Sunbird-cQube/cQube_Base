let logBaseDir = process.env.BASE_DIR

var filePaths = {
    application_nodejs_info_log: {
        title: 'cQube web node js info logs (last 200 lines)',
        path: `${logBaseDir}/cqube/logs/server_side-out.log`,
    },
    application_nodejs_error_log: {
        title: 'cQube web node js error logs (last 200 lines)',
        path: `${logBaseDir}/cqube/logs/server_side-error.log`
    },
    application_angular_info_log: {
        title: 'cQube web angular info logs (last 200 lines)',
        path: `${logBaseDir}/cqube/logs/client_side-out.log`
    },
    application_angular_error_log: {
        title: 'cQube web angular error logs (last 200 lines)',
        path: `${logBaseDir}/cqube/logs/client_side-error.log`
    },
    admin_nodejs_info_log: {
        title: 'cQube admin node js info logs',
        path: `${logBaseDir}/cqube/logs/admin_server_side-out.log`,
    },
    admin_nodejs_error_log: {
        title: 'cQube admin node js error logs',
        path: `${logBaseDir}/cqube/logs/admin_server_side-error.log`
    },
    admin_angular_info_log: {
        title: 'cQube admin angular info logs',
        path: `${logBaseDir}/cqube/logs/admin_client_side-out.log`
    },
    admin_angular_error_log: {
        title: 'cQube admin angular error logs',
        path: `${logBaseDir}/cqube/logs/admin_client_side-error.log`
    },
    nifi_app_log: {
        title: 'cQube nifi app log (last 200 lines)',
        path: `${logBaseDir}/cqube/logs/nifi-app.log`
    },
    nifi_bootstrap_log: {
        title: 'cQube nifi bootstrap log (last 200 lines)',
        path: `${logBaseDir}/cqube/logs/nifi-bootstrap.log`
    },
    emission_access_log: {
        title: 'cQube emission access log (last 200 lines)',
        path: `${logBaseDir}/cqube/logs/emission_app-access.log`
    },
    emission_error_log: {
        title: 'cQube emssion error log (last 200 lines)',
        path: `${logBaseDir}/cqube/logs/emission_app-error.log`
    },
    syslog_log: {
        title: 'cQube syslog log (last 200 lines)',
        path: `${logBaseDir}/cqube/logs/syslog`
    },
    postgresql_log: {
        title: 'cQube postgresql log (last 200 lines)',
        path: `${logBaseDir}/cqube/logs/postgresql-10-main.log`
    }
}

var menus = [
    {
        name: "Application",
        children: [
            {
                name: 'Node Info Logs',
                key: 'application_nodejs_info_log'
            },
            {
                name: 'Node Error Logs',
                key: 'application_nodejs_error_log'
            },
            {
                name: 'Angular Info Logs',
                key: 'application_angular_info_log'
            },
            {
                name: 'Angular Error Logs',
                key: 'application_angular_error_log'
            }
        ],
    },
    {
        name: "Admin",
        children: [
            {
                name: 'Node Info Logs',
                key: 'admin_nodejs_info_log'
            },
            {
                name: 'Node Error Logs',
                key: 'admin_nodejs_error_log'
            },
            {
                name: 'Angular Info Logs',
                key: 'admin_angular_info_log'
            },
            {
                name: 'Angular Error Logs',
                key: 'admin_angular_error_log'
            },
        ]
    },
    {
        name: "Nifi",
        children: [
            {
                name: 'App Logs',
                key: 'nifi_app_log'
            },
            {
                name: 'Bootstrap Logs',
                key: 'nifi_bootstrap_log'
            }]
    },
    {
        name: "Emission",
        children: [
            {
                name: 'Emission Access Logs',
                key: 'emission_access_log'
            },
            {
                name: 'Emission Error Logs',
                key: 'emission_error_log'
            },
        ]
    },
    {
        name: "System",
        children: [
            {
                name: 'System Logs',
                key: 'syslog_log'
            }
        ]
    },
    {
        name: "PostgreSql",
        children: [
            {
                name: 'PostgreSQL Logs',
                key: 'postgresql_log'
            }
        ]
    }
]

module.exports = {
    filePaths,
    menus
};