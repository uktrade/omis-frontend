const proxyquire = require('proxyquire')

let originalEnv

function createConfig (stubs = {}) {
  const defaults = {
    'os': {
      cpus: jasmine.createSpy('os.cpus').and.callFake(() => []),
    },
  }

  const defaultedStubs = Object.assign({}, defaults, stubs)

  return proxyquire('../../../app/config.js', defaultedStubs)
}

describe('Config', function () {
  beforeAll(() => {
    originalEnv = JSON.stringify(process.env)
  })

  afterEach(() => {
    process.env = JSON.parse(originalEnv)
  })

  describe('A boolean env var', function () {
    describe('Setting it to true', function () {
      it('Should have a boolean set to true', function () {
        process.env.CACHE_VIEWS = 'true'
        const config = createConfig()

        expect(config.views.cache).toEqual(true)
      })
    })

    describe('Setting it to true', function () {
      it('Should have a boolean set to true', function () {
        process.env.CACHE_VIEWS = 'false'
        const config = createConfig()

        expect(config.views.cache).toEqual(false)
      })
    })
  })

  describe('Showing errors', function () {
    describe('In production', function () {
      it('Should be false', function () {
        process.env.NODE_ENV = 'production'
        const config = createConfig()

        expect(config.showErrors).toEqual(false)
      })
    })

    describe('In development', function () {
      it('Should be true', function () {
        process.env.NODE_ENV = 'development'
        const config = createConfig()

        expect(config.showErrors).toEqual(true)
      })
    })
  })

  describe('Server workers', function () {
    beforeEach(function () {
      delete process.env.SERVER_WORKERS
    })

    describe('When the env var is set', function () {
      it('Should use that number', function () {
        process.env.SERVER_WORKERS = 3
        const config = createConfig()

        expect(config.server.workers).toEqual(3)
      })
    })

    describe('When no env var is set', function () {
      describe('When the system has 1 CPU', function () {
        it('Should set the workers to 1', function () {
          const cpus = jasmine.createSpy('os.cpus').and.callFake(() => new Array(1))

          const config = createConfig({
            'os': { cpus },
          })

          expect(config.server.workers).toEqual(1)
          expect(cpus).toHaveBeenCalled()
        })
      })

      describe('When the system has more than 1 CPU', function () {
        it('Should set the workers to 1 less than the number of CPUs', function () {
          const cpus = jasmine.createSpy('os.cpus').and.callFake(() => new Array(4))

          const config = createConfig({
            'os': { cpus },
          })

          expect(config.server.workers).toEqual(3)
          expect(cpus).toHaveBeenCalled()
        })
      })
    })
  })
})
