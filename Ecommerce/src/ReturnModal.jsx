import { useState } from "react";

function ReturnModal({

show,

onClose,

onSubmit,

order

}) {

const [returnType,setReturnType]=useState("RETURN");

const [reason,setReason]=useState("");

const [description,setDescription]=useState("");

const [images,setImages]=useState([]);

const [agree,setAgree]=useState(false);

const reasons=[

"Wrong Product",

"Damaged Product",

"Missing Accessories",

"Defective Product",

"Quality Issue",

"Changed Mind",

"Received Late",

"Other"

];

if(!show) return null;

const handleImageUpload=(e)=>{

const files=Array.from(e.target.files);

setImages(files);

};

const submitReturn=()=>{

if(reason===""){

alert("Please select return reason");

return;

}

if(!agree){

alert("Please accept return policy");

return;

}

onSubmit({

type:returnType,

reason,

description,

images,

orderId:order.id,

refundAmount:order.totalAmount,

paymentMethod:order.paymentMethod

});

onClose();

};

return(

<div
className="modal fade show"
style={{

display:"block",

background:"rgba(0,0,0,.5)"

}}

>

<div className="modal-dialog modal-lg modal-dialog-centered">

<div className="modal-content rounded-4">

<div className="modal-header bg-danger text-white">

<h4>

Return / Replace Product

</h4>

<button

className="btn-close btn-close-white"

onClick={onClose}

></button>

</div>

<div className="modal-body">

<div className="btn-group w-100 mb-4">

<button

className={`btn ${
returnType==="RETURN"
?"btn-danger"
:"btn-outline-danger"
}`}

onClick={()=>setReturnType("RETURN")}

>

↩ Return

</button>

<button

className={`btn ${
returnType==="REPLACE"
?"btn-primary"
:"btn-outline-primary"
}`}

onClick={()=>setReturnType("REPLACE")}

>

🔄 Replace

</button>

<button

className={`btn ${
returnType==="EXCHANGE"
?"btn-success"
:"btn-outline-success"
}`}

onClick={()=>setReturnType("EXCHANGE")}

>

♻ Exchange

</button>

</div>

<div className="mb-3">

<label className="form-label">

Select Reason

</label>

<select

className="form-select"

value={reason}

onChange={(e)=>setReason(e.target.value)}

>

<option value="">

Choose Reason

</option>

{

reasons.map((r,index)=>(

<option

key={index}

value={r}

>

{r}

</option>

))

}

</select>

</div>

<div className="mb-3">

<label>

Description

</label>

<textarea

className="form-control"

rows={4}

placeholder="Describe your issue..."

value={description}

onChange={(e)=>

setDescription(e.target.value)

}

/>

</div>

<div className="mb-3">

<label>

Upload Images

</label>

<input

type="file"

multiple

className="form-control"

accept="image/*"

onChange={handleImageUpload}

/>

</div>

<div className="row">

<div className="col-md-6">

<div className="card shadow-sm">

<div className="card-body">

<h6>

Refund Amount

</h6>

<h4 className="text-success">

₹{order.totalAmount}

</h4>

</div>

</div>

</div>

<div className="col-md-6">

<div className="card shadow-sm">

<div className="card-body">

<h6>

Payment Method

</h6>

<h4>

{order.paymentMethod}

</h4>

</div>

</div>

</div>

</div>
<div className="mt-4">

<div className="alert alert-warning rounded-4">

<h6 className="fw-bold">
📋 Return Policy
</h6>

<ul className="mb-0">

<li>Product should be returned in original condition.</li>

<li>All accessories must be included.</li>

<li>No physical damage caused by customer.</li>

<li>Refund will be processed after quality inspection.</li>

<li>Pickup will be scheduled within 24 Hours.</li>

</ul>

</div>

</div>

<div className="form-check mt-3">

<input
className="form-check-input"
type="checkbox"
checked={agree}
onChange={(e)=>setAgree(e.target.checked)}
id="agreeReturn"
/>

<label
className="form-check-label"
htmlFor="agreeReturn"
>

I agree to the Return & Refund Policy.

</label>

</div>

{
images.length>0 && (

<div className="mt-4">

<h6 className="fw-bold">

Uploaded Images

</h6>

<div className="row">

{

images.map((img,index)=>(

<div
className="col-md-3 mb-3"
key={index}
>

<div className="card">

<div className="card-body text-center">

🖼

<p
className="small mt-2 mb-0"
>

{img.name}

</p>

</div>

</div>

</div>

))

}

</div>

</div>

)

}

</div>

<div className="modal-footer">

<button

className="btn btn-secondary"

onClick={onClose}

>

Cancel

</button>

<button

className="btn btn-danger"

onClick={submitReturn}

>

Submit Request

</button>

</div>

</div>

</div>

</div>

);

}

export default ReturnModal;