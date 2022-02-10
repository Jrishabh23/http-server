const http = require("http");
let _id = 1;
const data = [];
http.createServer((req, res) => {
    /**
     * @desc create data
     */
    if (/create/.test(req.url) && req.method === "POST") {
        const userUrl = req.url.replace("/create?", "");
        const searchParams = new URLSearchParams(userUrl);
        let newData = {};
        for (let data of searchParams) {
            newData[data[0]] = data[1];
        }
        newData["_id"] = _id;
        _id++;
        data.push(newData);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write(JSON.stringify("User added successfully"));
        res.end();
    }
    /**
     * @desc list data
     */
    if (/users/.test(req.url) && req.method === "GET") {
        //check query string parameter
        const userUrl = req.url.replace("/users?", "");
        const searchParams = new URLSearchParams(userUrl);
        /**
         * @desc if have any search parameter
         */
        if (searchParams.has("search")) {
            const searchData = searchParams.get("search");
            const userDataIndex = data.filter((item) => {
                if (item["_id"] == searchData || item["name"] == searchData) {
                    return item;
                }
            });
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(userDataIndex));
            res.end();
            return;
        }
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write(JSON.stringify(data));
        res.end();
    }
    /**
     * @desc delete user
     */
    if (/delete-user/.test(req.url) && req.method === "DELETE") {
        const id = req.url.replace("/delete-user/", "");
        /**
         * @desc check id number or not
         */
        if (isNaN(id) && !isFinite(id)) {
            res.writeHead(200, { "Content-Type": "json" });
            res.write("Please provide valid id");
            res.end();
        }
        /**
         * @desc check data is exist or not
         */
        const userDataIndex = data.filter((item, index) => {
            if (item["_id"] == id) {
                return data.splice(index, 1);
            }
        });
        /**
         * @desc if id not found
         */
        if (userDataIndex.length <= 0) {
            res.writeHead(200, { "Content-Type": "json" });
            res.write("User data not found");
            res.end();
        }
        res.writeHead(200, { "Content-Type": "json" });
        res.write("User data deleted");
        res.end();
    }

    /**
     * @desc update data
     */
    if (/update-user/.test(req.url) && req.method === "PATCH") {
        const updateData = req.url.replace("/update-user?", "");
        const params = new URLSearchParams(updateData);
        let _id = false;
        if (params.has("id")) {
            _id = params.get("id");
            /**
             * @desc check data is exist or not
             */

            const userDataIndex = data.filter((item, index) => {
                if (item["_id"] == _id) {
                    data.splice(index, 1);
                    for (let uData of params) {
                        if (uData[0] !== "id") {
                            item[uData[0]] = uData[1];
                        }
                    }
                    return data.splice(index, 0, item);
                }
            });
        }
        res.writeHead(200, { "Content-Type": "json" });
        res.write("User data updated");
        res.end();
    }
}).listen(8000);
