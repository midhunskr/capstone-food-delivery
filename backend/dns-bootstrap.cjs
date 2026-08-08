// Local development workaround:
// Node's system DNS resolver currently resolves to 127.0.0.1,
// where no DNS service is listening. Use Cloudflare DNS instead.

const dns = require("node:dns");

dns.setServers(["1.1.1.1", "1.0.0.1"]);