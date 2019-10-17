var Helpers = (function (){
    return {
        toDateTimeString: function(value){
            return (true !== wna.IsNullOrEmpty(value)) ? moment(value).utc().format('YYYY/MM/DD HH:mm:ss') : value;
        }
    }    
})();
