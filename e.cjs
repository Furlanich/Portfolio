const fs=require('fs');
let y=fs.readFileSync('.github/workflows/ci.yml','utf8').replace(/\r\n/g,'\n');
const old=`            getent hosts "$host" | grep -q '^127\.0\.0\.1 ' || { echo "$host does not resolve to loopback"; exit 1; }\n`;
if(!y.includes(old)) throw new Error('no match');
y=y.replace(old, `            addresses=$(getent ahosts "$host" | awk '{ print $1 }' | sort -u)\n            [ "$addresses" = "127.0.0.1" ] || { echo "$host resolves to: $addresses"; exit 1; }\n`);
y=y.replace("      - name: Prove provider traffic is blocked\n        run: |\n", "      # getaddrinfo order, as the browser resolves it: `getent hosts` would print an IPv4-mapped address.\n      - name: Prove provider traffic is blocked\n        run: |\n");
fs.writeFileSync('.github/workflows/ci.yml',y.replace(/\n/g,'\r\n'));
