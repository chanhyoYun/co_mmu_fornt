async function navOnload() {
    let navbarHtml = await fetch('/templates/nav.html')
    let data = await navbarHtml.text()
    document.querySelector("header").innerHTML = data;

    // 로그인 안되어 있으면 회원가입, 로그인 버튼 띄우기
    const payload = localStorage.getItem("payload")
    if (payload === null) {
        const login_btn = document.getElementById("login_btn")
        login_btn.setAttribute("style", "display: block;")
        const sign_btn = document.getElementById("sign_btn")
        sign_btn.setAttribute("style", "display: block;")

        const write_btn = document.getElementById("write_btn")
        write_btn.setAttribute("style", "display: none;")
        const mypage_btn = document.getElementById("mypage_btn")
        mypage_btn.setAttribute("style", "display: none;")
        const logout_btn = document.getElementById("logout_btn")
        logout_btn.setAttribute("style", "display: none;")
    }
    else {
        const login_btn = document.getElementById("login_btn")
        login_btn.setAttribute("style", "display: none;")
        const sign_btn = document.getElementById("sign_btn")
        sign_btn.setAttribute("style", "display: none;")

        const write_btn = document.getElementById("write_btn")
        write_btn.setAttribute("style", "display: flex;")
        const mypage_btn = document.getElementById("mypage_btn")
        mypage_btn.setAttribute("style", "display: flex;")
        const logout_btn = document.getElementById("logout_btn")
        logout_btn.setAttribute("style", "display: flex;")
    }
}

navOnload()

// 마이페이지 이동
async function myPage() {
    const user = localStorage.getItem("payload")
    const user_id = user.split(':')[5].slice(0, -1);
    location.href = `/templates/users/profile.html?id=${user_id}`
}

// 검색 기능
async function handleSearch() {
    const search = document.getElementById("search").value;

    const response = await fetch('http://127.0.0.1:8000/articles/search/?search='+ search, {
        method:"GET"
    })
    response_json = await response.json()
    location.href = `/templates/article/search_page.html?search=${search}`
}

function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.href = '/templates/main.html';
}