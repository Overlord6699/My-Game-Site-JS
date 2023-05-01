$('.open_pop_up').click(function(e) 
{
    e.PreventDefault();
    $('.pop_up-bg').fadeIn(600);
});

$('.close_pop_up').click(function(e) 
{
    e.PreventDefault();
    $('.pop_up-bg').fadeOut(600);
});