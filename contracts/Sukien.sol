pragma solidity >=0.5.0 <0.6.0;

////////----------------////
contract Sukien  {
    //cấu trúc vé
    struct Ve{
        uint id;
        uint mssv;
        string ho;
        string ten;
        string masukien;
        string mave;
    }
    //mang ve với cấu trúc
    uint public nextId;
    
    //trạng thái
   mapping(uint => Ve) public Ves ;
   ///Su kien
   event taoVe(uint _mssv, string _ho, string _ten);
   ///
   /////
     modifier checkma(uint _mssv,string memory _masukien) {
      require(checkMssv(_mssv,_masukien)!=false);
         _;
   }
   modifier checkUser(){
       address tk = 0x5d1224F28d6FeB5E0f7B6D29e90A3D9beabDcF20;
       address tk2 = msg.sender;
       require(tk != tk2);
           _;
   }
   function checkMssv(uint _mssv, string memory _masukien) view private returns(bool) {
         for( uint i=1; i<= nextId; i++){
             if(_mssv == Ves[i].mssv && keccak256(abi.encodePacked(_masukien)) == keccak256(abi.encodePacked(Ves[i].masukien)) ){
                return false;
             }
         }
         return true;
     }
    function concat(bytes memory a, bytes memory b)
            internal pure returns (bytes memory) {
        return abi.encodePacked(a, b);
    }
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
    //  string memory _mave
    //   checkMave(_mssv, _mave)
    /////------------///
    function createVe (uint _mssv, string memory _ho, string memory _ten, string memory _masukien) public  checkma(_mssv,_masukien)  {
        //check
        //Tạo cấu trúc vé
        nextId++;
        Ves[nextId] = Ve(nextId, _mssv, _ho, _ten, _masukien,string(concat(bytes(_masukien), bytes(uint2str(_mssv)))));
        emit taoVe(_mssv,_ho,_ten);
    }
    function search(uint _mssv) public view returns (uint, string memory, string memory, string memory,string memory){
        for(uint i =1; i<= nextId;i++){
            if(_mssv == Ves[i].mssv){
                string memory ho = Ves[i].ho;
                string memory ten = Ves[i].ten;
                string memory masukien = Ves[i].masukien;
                string memory mave = Ves[i].mave;
                // string memory masukien = Ves[i].masukien;
                return (_mssv,ho,ten,masukien,mave);
            }
        }
    }
}