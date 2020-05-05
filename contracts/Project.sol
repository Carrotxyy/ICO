pragma solidity ^0.4.26;

/** 
* @title SafeMath 
* @dev Math operations with safety checks that throw on error 
*/ 

library SafeMath { 
    function mul(uint a, uint b) internal pure returns (uint) { 
        uint c = a * b; 
        assert(a == 0 || c / a == b); 
        return c;
    }
    function div(uint a, uint b) internal pure returns (uint) { 
        // assert(b > 0); // Solidity automatically throws when dividing by 0 
        uint c = a / b; 
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold 
        return c; 
    } 
    function sub(uint a, uint b) internal pure returns (uint) { 
        assert(b <= a); 
        return a - b; 
    } 
    function add(uint a, uint b) internal pure returns (uint) { 
        uint c = a + b; 
        assert(c >= a); 
        return c; 
    } 
}


contract ProjectList{
    using SafeMath for uint;
    // 项目集合
    address[] public  projectList;
    
    function createProject(string _des,uint _min,uint _max,uint _total) public {
        // 生成项目
        address addr = new Project(msg.sender,_des,_min,_max,_total);
        
        projectList.push(addr);
    }
    
    // 返回所有项目address
    function getProjects() public view returns(address[]){
        return projectList;
    }
    
}



contract Project{
    using SafeMath for uint;
    // 项目的发起者
    address public owner;
    // 项目的描述
    string public describe;
    // 最小投资金额
    uint public minInvest;
    // 最大投资金额
    uint public maxInvest;
    // 现在募集到的资金总数 就是合约的余额
    // uint public currentInvest;
    // 众筹目标金额
    uint public totalInvest;
    // 投资人列表
    address[] investors;
    // 投资情况
    mapping(address => uint )investorinfo ; 
    // 使用资金的情况
    Payment[] public  paymentList;
    
    /**
    资金的支出目的
    具体的金额
    接收人是谁
    投票赞成的股东有哪些 supports
    反对意见的股东  opposes  
    投票是否已经结束
    **/
    struct Payment{
        string des;
        uint amount;
        address recevier;
        address[] support;
        address[] oppose;
        bool isAccomplish;
    }
    
    // 初始化数据-  发起者地址 项目的描述 最小投资金额  最大投资金额 众筹目标金额
    constructor(address addr,string des,uint min,uint max,uint total) public {
        owner =addr;
        describe = des;
        minInvest = min;
        maxInvest = max;
        totalInvest = total;
    }
    
    modifier MustContractCreator(){
        require(owner == msg.sender,"只有项目的发起者才能进行操作");
        _;
    }
    
    // 判断是否存在于数组中
    function isExist(address[] arr , address target) pure returns(bool){
        for(uint i = 0 ; i < arr.length ; i++){
            if(arr[i] == target){
                return true;
            }
        }
        return false;
    }
    
    // 投资
    function invest()public payable{
        // 
        require(msg.value >= minInvest , "投资金额不得小于最小金额");
        require(msg.value <= maxInvest,"投资金额不得大于最大金额");
        
        uint currentInvest = 0;
        currentInvest = address(this).balance + msg.value;
        require(currentInvest <= totalInvest , "获得的投资金额已超出目标金额");
        
        // 如果不存在，则添加进投资者列表
        if(!isExist(investors,msg.sender)){
            investors.push(msg.sender);
        }
        
        investorinfo[msg.sender] += msg.value;
        
    }
    
    // 创建一笔支出
    function createPayment(string _des,uint _amount,address _recevier)public MustContractCreator{
        require(paymentList[paymentList.length - 1].isAccomplish == true , "上一笔申请的资金尚未完成!");
        require(_amount <= address(this).balance,"需求资金不能大于募资资金余额");
        
        
        /**
        资金的支出目的
        具体的金额
        接收人是谁
        投票赞成的股东有哪些 supports
        反对意见的股东  opposes  
        投票是否已经结束
        **/
        Payment memory p = Payment({
            des:_des,
            amount:_amount,
            recevier:_recevier,
            support:new address[](0),
            oppose:new address[](0),
            isAccomplish:false
        });
        
        paymentList.push(p);
    }
    
    // 股东是否答应和投票通过资金输出
    function approvePayment(bool isOrNo) public {
        // 申请资金机制:每次只申请一个,当这个申请通过或者失败。才能进行下一个资金的申请
        // 所以每次投票的都是最后一个资金申请对象
        Payment storage p = paymentList[paymentList.length - 1];
        require(p.isAccomplish,"投票已结束");
        require(!isExist(p.support,msg.sender) ,"你已经投过赞成票！" );
        require(!isExist(p.oppose,msg.sender) , "你已经投过反对票！");
        if(isOrNo){
            // 赞同
            p.support.push(msg.sender);
        }else{
            // 反对
            p.oppose.push(msg.sender);
        }
        // 验证
        veri(p);
    }
    
    // 判断当前申请资金是否能结算(发放 | 拒绝)
    // Payment storage p 设置成指针传递
    function veri(Payment storage p) internal {
        
        uint half = investors.length / 2;
        if(p.support.length > half){
            // 赞成者大于半数
            p.isAccomplish = true;
            // 转账
            p.recevier.transfer(p.amount);
        }else if(p.oppose.length > half){
            // 反对者大于半数(反对者大于半数投票也结束了，要判断是发放还是拒绝，则通过赞成、反对数组的长度，谁的大于半数则是什么结果)
            p.isAccomplish = true;
        }
    }
    
    
    // 获取项目中基础信息
    function getAll() public view returns(address,string,uint,uint,uint,uint,uint){
        // 发起人,描述，最小，最大，当前获得的资金，目标，投资者人数
        return (owner,describe,minInvest,maxInvest,address(this).balance,totalInvest,investors.length);
    }
    
    // 获取指定地址的投资金额
    function getInvestInfo(address investor) public view returns(uint){
        return investorinfo[investor];
    }
    
    function()payable public{}
    
}
