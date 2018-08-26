'use strict';

const EventEmitter = require('events');
const requestParser = require('../../src/lib/request-parser');

describe('request-parser', () => {
  it('resolves with request', () => {
    var req = new FakeRequest('http://localhost:3000/fake');
    
    return requestParser(req).then(result => {
      expect(result).toBe(req);
    });
  });

  it('parses url into parsedUrl', () => {
    var req = new FakeRequest('http://localhost:3000/fake?qs=1');

    return requestParser(req).then(() => {
      expect(req.parsedUrl).toBeDefined();
      expect(req.parsedUrl.pathname).toBe('/fake');
      expect(req.parsedUrl.query).toBe('qs=1');
    });
  });

  it('parses query string into query', () => {
    var req = new FakeRequest('http://localhost:3000/fake?a=1&b=2');

    return requestParser(req).then(() => {
      expect(req.query).toBeDefined();
      expect(req.query.a).toBe('1');
      expect(req.query.b).toBe('2');
    });
  });
});

class FakeRequest extends EventEmitter {
  constructor(url, method = 'GET') {
    super();
    this.url = url;
    this.method = method;
  }
}
