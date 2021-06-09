var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerApiClient = void 0;
var node_fetch_1 = require("node-fetch");
var CrawlerApiClient = (function () {
    function CrawlerApiClient(_a) {
        var crawlerUserId = _a.crawlerUserId, crawlerApiBaseUrl = _a.crawlerApiBaseUrl, crawlerApiKey = _a.crawlerApiKey;
        this.crawlerUserId = crawlerUserId;
        this.crawlerApiKey = crawlerApiKey;
        this.crawlerApiBaseUrl = crawlerApiBaseUrl;
    }
    Object.defineProperty(CrawlerApiClient.prototype, "basicAuthToken", {
        get: function () {
            return "Basic " + Buffer.from(this.crawlerUserId + ":" + this.crawlerApiKey).toString('base64');
        },
        enumerable: false,
        configurable: true
    });
    CrawlerApiClient.__handleResponse = function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!res.ok) return [3, 2];
                        return [4, res.json()];
                    case 1: return [2, _a.sent()];
                    case 2: return [4, res.json()];
                    case 3:
                        error = _a.sent();
                        throw new Error(res.status + ": " + res.statusText + "\n" + (error ? JSON.stringify(error) : ''));
                }
            });
        });
    };
    CrawlerApiClient.prototype.createCrawler = function (name, jsonConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var body, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = {
                            name: name,
                            config: jsonConfig,
                        };
                        return [4, node_fetch_1.default(this.crawlerApiBaseUrl + "/crawlers", {
                                method: 'POST',
                                headers: {
                                    Authorization: this.basicAuthToken,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(body),
                            })];
                    case 1:
                        res = _a.sent();
                        return [2, CrawlerApiClient.__handleResponse(res)];
                }
            });
        });
    };
    CrawlerApiClient.prototype.updateCrawler = function (_a) {
        var id = _a.id, name = _a.name, jsonConfig = _a.jsonConfig;
        return __awaiter(this, void 0, void 0, function () {
            var body, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        body = {
                            name: name,
                            config: jsonConfig,
                        };
                        return [4, node_fetch_1.default(this.crawlerApiBaseUrl + "/crawlers/" + id, {
                                method: 'PATCH',
                                headers: {
                                    Authorization: this.basicAuthToken,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(body),
                            })];
                    case 1:
                        res = _b.sent();
                        return [2, CrawlerApiClient.__handleResponse(res)];
                }
            });
        });
    };
    CrawlerApiClient.prototype.getCrawlers = function (itemsPerPage, page) {
        return __awaiter(this, void 0, void 0, function () {
            var searchParams, qs, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchParams = {};
                        if (itemsPerPage)
                            searchParams.itemsPerPage = itemsPerPage;
                        if (page)
                            searchParams.page = page;
                        qs = Object.keys(searchParams)
                            .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(searchParams[k]); })
                            .join('&');
                        return [4, node_fetch_1.default(this.crawlerApiBaseUrl + "/crawlers" + (qs ? "?" + qs : ''), {
                                headers: {
                                    Authorization: this.basicAuthToken,
                                },
                            })];
                    case 1:
                        res = _a.sent();
                        return [2, CrawlerApiClient.__handleResponse(res)];
                }
            });
        });
    };
    CrawlerApiClient.prototype.updateConfig = function (id, partialJsonConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, node_fetch_1.default(this.crawlerApiBaseUrl + "/crawlers/" + id + "/config", {
                            method: 'PATCH',
                            headers: {
                                Authorization: this.basicAuthToken,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(partialJsonConfig),
                        })];
                    case 1:
                        res = _a.sent();
                        return [2, CrawlerApiClient.__handleResponse(res)];
                }
            });
        });
    };
    CrawlerApiClient.prototype.getConfig = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, node_fetch_1.default(this.crawlerApiBaseUrl + "/crawlers/" + id + "?withConfig=true", {
                            headers: {
                                Authorization: this.basicAuthToken,
                            },
                        })];
                    case 1:
                        res = _a.sent();
                        return [2, CrawlerApiClient.__handleResponse(res)];
                }
            });
        });
    };
    CrawlerApiClient.prototype.getStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, node_fetch_1.default(this.crawlerApiBaseUrl + "/crawlers/" + id, {
                            headers: {
                                Authorization: this.basicAuthToken,
                            },
                        })];
                    case 1:
                        res = _a.sent();
                        return [2, CrawlerApiClient.__handleResponse(res)];
                }
            });
        });
    };
    CrawlerApiClient.prototype.getURLStats = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, node_fetch_1.default(this.crawlerApiBaseUrl + "/crawlers/" + id + "/stats/urls", {
                            headers: {
                                Authorization: this.basicAuthToken,
                            },
                        })];
                    case 1:
                        res = _a.sent();
                        return [2, CrawlerApiClient.__handleResponse(res)];
                }
            });
        });
    };
    CrawlerApiClient.prototype.reindex = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.__triggerAction({ crawlerId: id, actionName: 'reindex' })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    CrawlerApiClient.prototype.run = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.__triggerAction({ crawlerId: id, actionName: 'run' })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    CrawlerApiClient.prototype.pause = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.__triggerAction({ crawlerId: id, actionName: 'pause' })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    CrawlerApiClient.prototype.__triggerAction = function (_a) {
        var crawlerId = _a.crawlerId, actionName = _a.actionName;
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, node_fetch_1.default(this.crawlerApiBaseUrl + "/crawlers/" + crawlerId + "/" + actionName, {
                            method: 'POST',
                            headers: {
                                Authorization: this.basicAuthToken,
                                'Content-Type': 'application/json',
                            },
                        })];
                    case 1:
                        res = _b.sent();
                        return [2, CrawlerApiClient.__handleResponse(res)];
                }
            });
        });
    };
    CrawlerApiClient.prototype.waitForTaskToComplete = function (_a) {
        var crawlerId = _a.crawlerId, taskId = _a.taskId;
        return __awaiter(this, void 0, void 0, function () {
            var res, pending;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, node_fetch_1.default(this.crawlerApiBaseUrl + "/crawlers/" + crawlerId + "/tasks/" + taskId, {
                            headers: {
                                Authorization: this.basicAuthToken,
                            },
                        })];
                    case 1:
                        res = _b.sent();
                        return [4, res.json()];
                    case 2:
                        pending = (_b.sent()).pending;
                        if (!pending) return [3, 5];
                        return [4, new Promise(function (resolve) {
                                setTimeout(resolve, 1000);
                            })];
                    case 3:
                        _b.sent();
                        return [4, this.waitForTaskToComplete({ crawlerId: crawlerId, taskId: taskId })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2];
                }
            });
        });
    };
    CrawlerApiClient.prototype.testUrl = function (_a) {
        var crawlerId = _a.crawlerId, url = _a.url, config = _a.config;
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, node_fetch_1.default(this.crawlerApiBaseUrl + "/crawlers/" + crawlerId + "/test", {
                            method: 'POST',
                            headers: {
                                Authorization: this.basicAuthToken,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ url: url, config: config }),
                        })];
                    case 1:
                        res = _b.sent();
                        return [4, res.json()];
                    case 2: return [2, _b.sent()];
                }
            });
        });
    };
    return CrawlerApiClient;
}());
exports.CrawlerApiClient = CrawlerApiClient;
