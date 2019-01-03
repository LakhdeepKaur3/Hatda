// var registration = function( verificationUrl) {
// 	return (
// 		`
// 		<mjml>
// 			  <mj-body>
// 			    	<mj-text>
// 			    		Hi, thank you for registering. We are happy to have you on-board. Please click on the button below to verify your account
// 			    	</mj-text>
// 			    <mj-section>
// 			    	<mj-button href=${verificationUrl} background-color="#F45E43"> Verify </mj-button>
// 			    </mj-section>
// 			  </mj-body>
// 			</mjml>
// 		`
// 	);
// };

// module.exports = registration;
var registration = function() {
	return (
		`
			<mjml>
			  <mj-body>
			    <mj-section>
			    	<mj-text>
			    		Hi, thank you for registeration.
			    	</mj-text>
			    </mj-section>
			  </mj-body>
			</mjml>
		`
	);
};

module.exports = registration;