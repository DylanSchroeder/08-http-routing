'use strict';

const router = require('../../src/lib/router');

describe('router', () => {
  it('has no routes when initialized', () => {
    expect(router.routes.GET).toEqual({});
    expect(router.routes.POST).toEqual({});
    expect(router.routes.DELETE).toEqual({});

    console.log('initialized', router);
  });

  it('accepts new routes with per-method helpers', () => {
    router.get('/get', () => 'got');
    expect(router.routes.GET['/get']).toBeDefined();
    expect(router.routes.GET['/get']()).toBe('got');

    router.post('/post', () => 'posted');
    expect(router.routes.POST['/post']).toBeDefined();
    expect(router.routes.POST['/post']()).toBe('posted');

    router.delete('/api/book/1', () => 'gone');
    expect(router.routes.DELETE['/api/book/1']).toBeDefined();
    expect(router.routes.DELETE['/api/book/1']()).toBe('gone');

    router.delete('/api/author/2', () => 'real gone');
    expect(router.routes.DELETE['/api/author/2']).toBeDefined();
    expect(router.routes.DELETE['/api/author/2']()).toBe('real gone');

    console.log('with routes', router);
  });

  describe('route', () => {
    it('calls route callback if method and path match', () => {
      router.get('/test', (req, res) => {
        console.log('/test', req, res);
        res.statusCode = 200;
      });

      let req = {
        method: 'GET',
        url: 'http://localhost:1234/test',
      };
      let res = {};

      return router.route(req, res)
        .then(() => {
          expect(res.statusCode).toBe(200);
        });
    });

    it('rejects with 404 if method and path do not match', () => {
      let req = {
        method: 'GET',
        url: 'http://localhost:3000/not-found',
      };
      let res = {};

      return expect(router.route(req, res))
        .rejects.toBe(404);
    });
  });
});