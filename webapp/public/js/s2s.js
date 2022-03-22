let current_page;
loadjs(['/js/code-editor.js']);

const autoFill = {
    'originalMerchantTxId': 'merchantTxId',
    'merchantTxId': 'merchantTxId',
    'amount': 'amount',
    'customerId': 'customerId',
    'specinCreditCardToken': 'cardToken',
    'country': 'country',
    'currency': 'currency',
};
const initData = (page, needToken = true) => {
    console.log('page:::', page);
    current_page = page;
    if (needToken && !localStorage.getItem('cardToken')) {
        UIkit.modal.alert('Please request tokenize first').then(function () {
            return location.href = '/action/tokenize';
        });
    }

    Object.keys(autoFill).forEach(function (key) {
        if (document.getElementById(key) && localStorage.hasOwnProperty(autoFill[key])) {
            document.getElementById(key).value = localStorage.getItem(autoFill[key]);
        }
    });
};

/**
 * Service request
 * @returns {boolean}
 */
callService = () => {
    let formObject = document.querySelector('form');
    ipg.helpers.button.showLoading($('#submit_btn'));
    axios.post(
        '/call', new FormData(formObject),
    ).then(function (res) {
        window.editor_json.setValue(JSON.stringify(res.data, null, 4));
        if (res.data.result == 'redirection') {
            UIkit.notification('Need 3DS verify, please click the link to open it.',
                'danger');
            UIkit.util.$('#link_text>a').href = UIkit.util.$(
                '#link_text>a').innerText = res.data.redirectionUrl;
            UIkit.toggle('#extra_link',
                {'animation': 'uk-animation-fade', 'mode': 'media'}).toggle();
        } else if (res.data.result == 'success') {
            switch (current_page) {
                case 'purchase':
                case 'auth':
                    localStorage.setItem('merchantTxId', res.data['merchantTxId']);
                    localStorage.setItem('txId', res.data['txId']);
                    localStorage.setItem('amount', res.data['amount']);
                    localStorage.setItem('country', document.getElementById('country').value);
                    localStorage.setItem('currency', res.data['currency']);
                    break;
                case 'hosted_pay':
                    window.location.href = res.data['redirect_url'];
                    break;
				case 'standalone_pay':
                    window.location.href = res.data['redirect_url'];
                    break;
            }
        }
        console.log(res);
    }).catch(function (res) {
        console.log(res);
        window.editor_json.setValue(JSON.stringify(res, null, 4));
    }).finally(function (res) {
        ipg.helpers.button.hideLoading($('#submit_btn'));
    });
    return false;
};

