// var Allproduct=document.querySelectorAll(".product  li")  // لو هستدعي اكتر من عنصر
// var div=document.querySelector("#div1")  // لو هستدعي عنصر واحد بس
// var allprice=document.querySelector("#div2")
// var button=document.querySelector("#btn1")
// var total=0


// Allproduct.forEach(function(item){

//   // total+= +(item.getAttribute("price"))
//   item.onclick=function(){
//     div.innerHTML+= item.textContent

    
//   }

  // if (div!=""){
  //   button.style.display="blok"
  // }
// }

// )


// button.onclick=function(){
//   allprice.innerHTML=total
// }


// function triArea(base, hight){
//   console.log((base*hight)/2)
// }

// // triArea(4,5)



// function halfQuarterEighth(num){
//   console.log([num/2,num/4,num/8])
// }
// // halfQuarterEighth(6)
// //console.log((4*6)/2)

// function volumwOfBox(dec){
//   console.log(dec.width*dec.length*dec.hight)
// }

// volumwOfBox({width:4,length:2,hight:2})




// var val;
// for(var i=1;i<=100;i++){
//   val=""
//   if(i%3==0){
//     val+="Fizz"
//     if(i%5==0){
//       val+="Buzz"
//     }
//   }else if(i%5==0){
//       val+="Buzz"
//     }
//   else{
//     val+=i
//   }
//   console.log(val)
// }






// var x=prompt("enter number")
// var fact=1
// if (x==0||x==1){
//   console.log(1)
// }else{
//   for(var i=2;i<=x;i++){
//     fact*=i
//   }
//   console.log(fact)
// }

// var x=20
// var y="20" 
// console.log(x==y)
// console.log(x===y)
// console.log("ahmed"-5)


// function arrayToString(i){
//   var s=""
//   for(x=0;x<x.length;x++){
//     s+=i[x].arrayToString
//   }
// console.log(s)
// }
// function arrayToString(i){
//  return i.join("")
// }
// x=[1,2,3,4,5]
// arrayToString(x)
// console.log(arrayToString(x))




function isPrime(x){
if (x<=1){
  return false
}
  var prime=true

for(var i=2 ;i<x ; i++){
if(x%i==0){
  return false
}
}
return true

}

console.log(isPrime(2))

