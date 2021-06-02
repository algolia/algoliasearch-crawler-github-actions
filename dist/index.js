"use strict";
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = require('@actions/core');
var crawler_api_client_1 = require("./crawler-api-client");
// // CREDENTIALS
// const CRAWLER_USER_ID = "00000000-0000-4000-a000-000000000001";
// const CRAWLER_API_KEY = "14mn074r34l4p1k3yd0n7u53m31npr0d";
// const CRAWLER_API_BASE_URL = "http://localhost:7900/api/1/";
// // CREDENTIALS
// const CRAWLER_USER_ID = "478e6f93-7550-4850-9f3e-91ea853fa13d";
// const CRAWLER_API_KEY = "d4bc8f523e6f126c88ec07bb7da3611d";
// const CRAWLER_API_BASE_URL = "https://crawler-dev.algolia.com/api/1/";
//
// // CRAWLER CONFIGURATION
// const CRAWLER_NAME = 'damcou/simple-page/master'.replace(/\//g, '-');
// const ALGOLIA_APP_ID = 'Y34K42BB0X';
// const ALGOLIA_API_KEY = '64b0f8f5892b676971d5e1da39f0604a';
// const SITE_URL = 'https://crawler.algolia.com/test-website/';
// CREDENTIALS
var CRAWLER_USER_ID = core.getInput('crawler-user-id');
var CRAWLER_API_KEY = core.getInput('crawler-api-key');
var CRAWLER_API_BASE_URL = core.getInput('crawler-api-base-url');
// CRAWLER CONFIGURATION
var CRAWLER_NAME = core.getInput('crawler-name').replace(/\//g, '-');
var ALGOLIA_APP_ID = core.getInput('algolia-app-id');
var ALGOLIA_API_KEY = core.getInput('algolia-api-key');
var SITE_URL = core.getInput('site-url');
var client = new crawler_api_client_1.CrawlerApiClient({
    crawlerApiBaseUrl: CRAWLER_API_BASE_URL,
    crawlerUserId: CRAWLER_USER_ID,
    crawlerApiKey: CRAWLER_API_KEY
});
function getConfig() {
    return {
        appId: ALGOLIA_APP_ID,
        apiKey: ALGOLIA_API_KEY,
        indexPrefix: 'crawler_',
        maxUrls: 50,
        rateLimit: 8,
        startUrls: [SITE_URL],
        ignoreQueryParams: ['source', 'utm_*'],
        ignoreNoIndex: false,
        ignoreNoFollowTo: false,
        ignoreRobotsTxtRules: false,
        actions: [
            {
                indexName: CRAWLER_NAME + '_index',
                pathsToMatch: [SITE_URL + "**"],
                recordExtractor: {
                    __type: 'function',
                    source: getRecordExtractorSource(),
                },
            },
        ],
    };
}
function getRecordExtractorSource() {
    return "({ helpers }) => {\n  return helpers.netlifyExtractor({ template: 'default' });\n}";
}
function crawlerReindex() {
    return __awaiter(this, void 0, void 0, function () {
        var filteredCrawlers, crawlerId, currentPage, nbFetchedCrawlers, crawlers, config, res, crawler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filteredCrawlers = [];
                    crawlerId = '';
                    currentPage = 1;
                    nbFetchedCrawlers = 0;
                    _a.label = 1;
                case 1: return [4 /*yield*/, client.getCrawlers(100, currentPage++)
                        .catch(function (error) { return console.log(error); })];
                case 2:
                    crawlers = _a.sent();
                    if (typeof crawlers === "undefined") {
                        return [3 /*break*/, 4];
                    }
                    nbFetchedCrawlers += crawlers.items.length;
                    filteredCrawlers.push.apply(filteredCrawlers, __spreadArray([], __read(crawlers.items.filter(function (_a) {
                        var name = _a.name;
                        return name.indexOf(CRAWLER_NAME) === 0;
                    }))));
                    _a.label = 3;
                case 3:
                    if (crawlers.total > nbFetchedCrawlers) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4:
                    if (!(filteredCrawlers.length !== 0)) return [3 /*break*/, 6];
                    // If the crawler exists : update it
                    crawlerId = filteredCrawlers[0].id;
                    config = getConfig();
                    return [4 /*yield*/, client.updateConfig(crawlerId, config)];
                case 5:
                    res = _a.sent();
                    if (res.error) {
                        console.error(res.error.message);
                        console.error(JSON.stringify(res.error.errors));
                        throw new Error(res.error.message);
                    }
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, client.createCrawler(CRAWLER_NAME, getConfig())];
                case 7:
                    crawler = _a.sent();
                    crawlerId = crawler.id;
                    _a.label = 8;
                case 8:
                    console.log("---------- Reindexing crawler " + crawlerId + " ----------");
                    return [4 /*yield*/, client.reindex(crawlerId)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
console.log("---------CRAWLER CONFIG---------");
console.log("CRAWLER_NAME : " + CRAWLER_NAME);
crawlerReindex()
    .catch(function (error) { return console.log(error); });
