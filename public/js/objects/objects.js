var dataObj = {
	profiles:[]	
};

/*
var formObj = { 
			profile_info:{
				name: "None"
			},

			contact_info:{
				name: "",
				address: "",
				phone: "",
				ssn: ""
			},

			emergency_info:{
				name: "",
				address: "",
				phone: ""
			},

			primary_care_info:{
				name: "",
				phone: "",
				aff_hospitals:[]
			},

			insurance_info:{
				name: "",
				address: "",
				phone: ""
			},

			medication_info:[
				{
					drug_name: "",
					dosage: "",
					purpose: "",
					prescription_date: new Date()
				}
			],

			allergy_info:[
				{
					allergy_name: "",
					grade: ""
				}
			],

			chronic_illnesses_info:[
				{
					illness_name: "",
					date_of_diagnosis: new Date()
				}
			],

			previous_illnesses_info:[
				{
					illness_name: "",
					date_of_diagnosis: new Date()
				}
			],

			family_history_info:[
				{
					family_member: "",
					disease_name: "",
					age: "",
					cause_of_death: new Date(),
					date_of_death: new Date(),
				}
			],
			
			social_history_info:[
				{
					type: "",
					duration: "",
					quantity_per_week: ""
				}
			],

			lifestyle:[
				{
					type: "",
					duration: "",
					repeat: ""
				}

			],

			organ_donor_status: ""
		};
*/

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};