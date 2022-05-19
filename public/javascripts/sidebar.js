function sidebarClick(){
    const sidebar = document.querySelector(".sidebar")
    if(sidebar.classList.contains('hide-sidebar')){
        sidebarShow()
    }
    else{
        sidebarHide()
    }
}

function sidebarShow(){
    const sidebar = document.querySelector(".sidebar")
    sidebar.classList.remove('hide-sidebar')
}

function sidebarHide(){
    const sidebar = document.querySelector(".sidebar")
    sidebar.classList.add('hide-sidebar')
}