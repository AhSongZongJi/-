let obj = {
    name : 'zs',
    age : 18,
    address :{
        city : '上海'
    },
    arr :['a','b']
}
// 1 递归拷贝
let obj1 = deepCopy(obj)
// 2 使用json.stringify 这种方式在属性值为 function undefined 会忽略
// let obj1 = JSON.parse(JSON.stringify(obj))
// obj1.name = 'ls'
// obj1.address.city = '北京'
// obj1.arr[0] = 'c'
// console.log(obj1,'obj1');
// console.log(obj.address.city,'obj');
// console.log(obj.arr[0],'obj');




/**
 * 
 * @param {*Object} obj 
 */
// 深拷贝
function deepCopy(obj = {}){
    //  如果不是对象或者数组 自己返回
    if( typeof obj !== 'object' ) return obj

    let result 
    if( obj instanceof  Array ) {
        result = []
    } else {
        result = {}
    }

    for( let key in obj ){
        // 判断是不是自身的属性
        if( obj.hasOwnProperty(key)){
            result[key] = deepCopy(obj[key])
        }
    }

    return result
}


// 原型
function people(name,age){
    this.name = name
    this.age = age
}

people.prototype.sayHi =  function(){
    console.log(`我是${this.name},年龄${this.age}`);
}
// 通过构造函数new出来的实例  隐式原型指向的是构造函数的prototype
// let zhangs = new people('张三','22')
// zhangs.sayHi()
// // zhangs.__proto__ = {}
// console.log(zhangs.hasOwnProperty('sayHi'));
// console.log(zhangs instanceof people , 'instanceof'); // 是根据—__proto__ 来和 父类的prototype做对比 如果一样就是true
// console.log(people.prototype,'prototype');
// console.log(zhangs.__proto__,'propo');
// console.log(people.prototype === zhangs.__proto__);


//  作用域  一个变量的合法使用范围 
//  1 全局作用域
//  2 函数作用域 
//  3 块级作用域

//  闭包
//  1 函数作为返回值 
//  2 函数作为参数 


// 手写bind函数

Function.prototype.myBind = function(){

    // 将参数變成数组
    const args = Array.prototype.slice.call(arguments)
    // 获取this
    const t = args[0]

    // 获取调用者
    const self = this


    // 手写 call 
    // arguments[1] ?  self.apply(t,arguments) :self.apply() 

    // 手写 apply
    // arguments[1] ? self.apply(t,[...arguments]) : self.apply()

 

    // 返回一个函数  也可以用箭头函数
    // 手写bind
    return function() {
        return self.apply(t,args)
    }
}


function fn(x,y,z){
    console.log(this,'this');
    console.log(x , y,z);
    return  '11111'
}
let fn1 =  fn.myBind({ x : 200 },20 ,50)
let res = fn1()
console.log(res,'res');
// fn.myBind( { x : 200 }, 20 , 5)

 async function aysnc222(){
    // let p  = Promise.reject('err1')

    // try {
    //     let res = await Promise.reject('err1')
    //     console.log(res,'res');
    // } catch (error) {
    //     console.log(error,'error');
    // }
} 

console.log( navigator,'navigator' )