# brightspot-js-modal

Our modal plugin is a wrapper for the Vex modal. If you use this plugin, you are responsible for bringing in your own vex JS via your own bower. If you are using Base, Base does that for you already. 

## Usage

The bsp-modal code uses http://github.hubspot.com/vex/ as it's base much like brightspot-js-carousel uses slick. To create a modal, create a div data attribute of 'data-bsp-modal' to trigger the JS init. Inside this div, create a div with class "modal-data", which is where you modal contents will go. There is an optional id that can be set to override the default id for custom CSS. Default is 'modal'. Example:

	<div data-bsp-modal data-bsp-modal-options='{"id" : "id-here"}'>
		<div class="modal-data">
			Modal Content Goes Here
		</div>
	</div>

To open said modal via a click, create a link with data-bsp-modal-open="id-here". Upon click of the link the modal will open. It can be closed with it's own close button, Esc key, or an off click. Example:

	<a data-bsp-modal-open="id-here" href="#">Open the modal with data-bsp-modal id of "id-here"</a>

When initialized the API for the modal is attached to the data attribute 'bsp-modal' of the original div, so you can:

	$('[data-bsp-modal-id-here]').data('bsp-modal').open()
	or
	$('[data-bsp-modal-id-here]').data('bsp-modal').close()

You can also listen to events on that div:

	$('[data-bsp-modal-id-here]').on('bsp-modal:open', function(){ alert('id-here modal opened!'); });

or on the body

	$('body').on('bsp-modal:open', function(event, modal) { 
		// modal is the instance of the modal object so you can close, open, etc 
		// example: modal.close(); 
	});

Lastly, the bsp-modal can just be imported into another JS plugin/module and used to interface with the modal. The open public API allows you to pass a Jquery object, theme and id to open a modal with that content. The modal will self attach to the Esc key and it's own close button, but you can also call the close public API function to close your modal.

	import bsp_modal from './bsp-modal'; 
	var myModal = Object.create(bsp_modal); 
	myModal.open($('<div>asdf</div>'); 
	myModal.close();

## Auto Open: 

Accounts for the use case of having a modal with a gallery sitting on a page and needed to be opend on page load. When there is a hash of `slide-X` in the URL, the modal code will detect that and automatically trigger itself.

## TODO:

Need to add unit testing and live examples. Also maybe pull vex via Bower into here into a dist folder and use that instead of just src