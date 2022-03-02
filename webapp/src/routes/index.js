import express from 'express';
import {
  TokenizeCall,
  PurchaseCall,
  AuthCall,
  CaptureCall,
  VoidCall,
  RefundCall,
  GetStatusCall,
  VerifyCall,
} from '../../../dist/';
import formidable from 'formidable';
import querystring from 'querystring';

const router = express.Router();

const merchant = {
  'merchantId': '168678',
  'password': '12345',
  'country': 'GB',
  'number': '4111111111111111',
  'currency': 'GBP',
};

let serverConfig = {
  'allowOriginUrl': 'http://127.0.0.1:3000',
  'merchantNotificationUrl': 'http://127.0.0.1:3000/result',
};

/**
 * middleware for domain bind site
 */
router.use(function(req, res, next) {
  const domainUrl = `${req.headers['x-forwarded-proto'] ?
      req.headers['x-forwarded-proto'] :
      'http'}://${req.headers['host']}`;
  serverConfig = {
    'allowOriginUrl': domainUrl,
    'merchantNotificationUrl': `${domainUrl}/result`,
  };
  next();
});

/**
 * Homepage
 */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'EVO SDK DEMO', 'page': 'home'});
});

/**
 * get request token
 */
router.post('/token', (req, res, next) => {
      const form = formidable({multiples: true});
      form.parse(req, (err, fields, files) => {
        if (err) {
          next(err);
        }
        console.log('fields[\'action\']', fields['action_type'], fields);
        const call = new PurchaseCall(Object.assign(fields, serverConfig));
        call.token().then(function(response) {
          console.log(response);
          res.json(Object.assign({
            'js_api_url': call.javaScriptUrl,
            'cashier_url': call.cashierUrl,
          }, response));
        }).catch(function(response) {
          console.log(response);
          res.json(response);
        });
      });
    },
);

/**
 * display action page
 */
router.get('/action/:type/', (req, res, next) => {
  const context = {
    title: 'EVO SDK DEMO',
    'page': req.params.type,
    'merchant': merchant,
    'merchantTxId': `EXAMPLE_${Date.now()}`,
  };
  res.render(req.params.type, context);
});

router.post('/call', function(req, res, next) {
  const form = formidable({multiples: true});
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    let call;
    if (fields['action_type'] == 'hosted_pay') {
      const landingUrl = `${serverConfig['merchantNotificationUrl']}/${fields['merchantTxId']}`;
      serverConfig['merchantLandingPageUrl'] = landingUrl;
      serverConfig['merchantNotificationUrl'] = landingUrl;
      call = new PurchaseCall(Object.assign(fields, serverConfig));
      call.token().then(function(response) {
        console.log(response);
        const cashier_params = {
          'merchantId': fields['merchantId'],
          'token': response.token,
          'integrationMode': 'hostedPayPage',
        };
        response['redirect_url'] = `${call.cashierUrl}?${querystring.stringify(
            cashier_params)}`;
        res.json(response);
      }).catch(function(response) {
        console.log(response);
        res.json(response);
      });
    } else {
      switch (fields['action_type']) {
        case 'tokenize':
          call = new TokenizeCall(Object.assign(fields, serverConfig));
          break;
        case 'purchase':
          call = new PurchaseCall(Object.assign(fields, serverConfig));
          break;
        case 'auth':
          call = new AuthCall(Object.assign(fields, serverConfig));
          break;
        case 'verify':
          call = new VerifyCall(Object.assign(fields, serverConfig));
          break;
        case 'capture':
          call = new CaptureCall(Object.assign(fields, serverConfig));
          break;
        case 'void':
          call = new VoidCall(Object.assign(fields, serverConfig));
          break;
        case 'refund':
          call = new RefundCall(Object.assign(fields, serverConfig));
          break;
        case 'get_status':
          call = new GetStatusCall(Object.assign(fields, serverConfig));
          break;
      }
      call.execute().then(function(response) {
        console.log(response);
        res.json(response);
      }).catch(function(response) {
        console.log(response);
        res.json(response);
      });
    }
  });
});

/**
 * redirect post request to get
 */
router.post('/result/:merchantTxId', function(req, res) {
  res.redirect(302, '/result/' + req.params.merchantTxId);
});

/**
 * display payment result by merchantTxId
 */
router.get('/result/:merchantTxId', function(req, res) {
  const call = new GetStatusCall(Object.assign({
    'merchantId': merchant.merchantId,
    'password': merchant.password,
    'merchantTxId': req.params.merchantTxId,
  }, serverConfig));
  call.execute().then(function(response) {
    console.log(response);
    res.render('result', {
      'response': JSON.stringify(response, null, 4),
      'title': 'Payment Result',
      'merchantTxId': req.params.merchantTxId,
      'hide_bottom': true,
    });
  }).catch(function(response) {
    console.log(response);
    res.render('result', {
      'response': JSON.stringify(response, null, 4),
      'title': 'Payment Result',
    });
  });
});

export default router;
