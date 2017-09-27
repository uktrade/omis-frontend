const middleware = require('../../../../app/middleware/set-csrf-token')

describe('errors middleware', function () {
  let req
  let res
  let next

  beforeEach(function () {
    req = {
      csrfToken: jasmine.createSpy('csrfToken').and.returnValue('TOKEN12345'),
    }
    res = {
      locals: {},
    }
    next = jasmine.createSpy('next')
  })

  describe('Set CRSF token middleware', function () {
    describe('setCsrfToken', function () {
      it('Should set CSRF_TOKEN on locals', function () {
        middleware()(req, res, next)

        expect(res.locals.CSRF_TOKEN).toEqual('TOKEN12345')
        expect(req.csrfToken).toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith()
      })
    })
  })
})
