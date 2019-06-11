$(document).ready(function(){
    $("button").click(function(){
        var modules=[];
        
        $.each($("input[name='module']:checked"), function(){            
            modules.push($(this).val());
        });

    
    });

});