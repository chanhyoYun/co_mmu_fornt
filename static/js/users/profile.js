window.onload = async function loadProfile() {
    const user = localStorage.getItem("payload")
    const user_id = user.split(':')[5].slice(0, -1);

    const urlParams = new URL(location.href).searchParams;
    const profile_id = urlParams.get('id');

    const response = await fetch('http://127.0.0.1:8000/users/profile/'+profile_id+'/', {
        method:"GET"
    })
    response_json = await response.json()

    // 유저 프로필 보기
    const profile_image = document.getElementById("profile_image")
    if (response_json["가입정보"]["profile_image_image"]===null) {
        profile_image.setAttribute("src", response_json["가입정보"]["profile_image_url"])
    }
    else {
        profile_image.src = 'http://127.0.0.1:8000' + response_json["가입정보"]['profile_image_image']
    }

    const email = document.getElementById("email")
    email.innerText = response_json["가입정보"]["email"]
        
    // 유저 작성 게시글 보기
    const user_articles = document.getElementById("user_articles")
    response_json["게시글"].forEach(art => {
        const user_article = document.createElement("li")
        const user_article_a = document.createElement("a")
        user_article_a.setAttribute("href", `/templates/article/detail_article.html?id=${art['id']}`)
        user_article_a.setAttribute("class", "article_container")
        user_article.appendChild(user_article_a)
        user_article.setAttribute("class", "article_card")

        const user_article_title = document.createElement("h3")
        user_article_title.innerText = art['title']
        const user_article_content = document.createElement("p")
        user_article_content.innerText = art['content']

        if (art['image']!==null) {
            const articles_img = document.createElement('img')
            articles_img.setAttribute("src", 'http://127.0.0.1:8000'+art['image'])
            user_article_a.appendChild(articles_img)
        }

        user_article_a.appendChild(user_article_title)
        user_article_a.appendChild(user_article_content)
        user_articles.appendChild(user_article)
    })

    // 좋아요 게시글 보기
    const user_like_articles = document.getElementById("user_like_articles")
    response_json["좋아요 게시글"].forEach(art => {
        const user_article = document.createElement("li")
        const user_article_a = document.createElement("a")
        user_article_a.setAttribute("href", `/templates/article/detail_article.html?id=${art['id']}`)
        user_article_a.setAttribute("class", "article_container")
        user_article.appendChild(user_article_a)
        user_article.setAttribute("class", "article_card")

        const user_article_title = document.createElement("h3")
        user_article_title.innerText = art['title']
        const user_article_content = document.createElement("p")
        user_article_content.innerText = art['content']

        if (art['image']!==null) {
            const articles_img = document.createElement('img')
            articles_img.setAttribute("src", 'http://127.0.0.1:8000'+art['image'])
            user_article_a.appendChild(articles_img)
        }

        user_article_a.appendChild(user_article_title)
        user_article_a.appendChild(user_article_content)
        user_like_articles.appendChild(user_article)
    })

    // 팔로우 보기
    const follows = document.getElementById("follows")
    response_json["가입정보"]["followings"].forEach(follow => {
        const user_follow = document.createElement("p")
        const user_follow_a = document.createElement("a")
        user_follow_a.setAttribute("id", follow['id'])
        user_follow_a.setAttribute("href", `../users/profile.html?id=${follow['id']}`)
        user_follow_a.innerText = follow['email']
        user_follow.appendChild(user_follow_a)
        follows.appendChild(user_follow)
    })

    // 프로필 유저와 로그인 유저가 같으면 수정하기 버튼 노출
    if (user_id===profile_id) {
        const profile_edit_btn = document.getElementById("profile_edit_btn")
        profile_edit_btn.setAttribute("style", "display:block;")

        const profile_edit_page = document.getElementById("profile_edit_page")
        profile_edit_page.setAttribute("href", `../users/profile_edit.html?id=${user_id}`)
    }

    // 팔로우 버튼을 위한 시작
    const response_user = await fetch('http://127.0.0.1:8000/users/profile/'+user_id+'/', {
        method:"GET"
    })
    response_user_json = await response_user.json()

    var user_followings = []
    response_user_json["가입정보"]["followings"].forEach(user => {
        user_followings.push(user["id"])
    })
    
    if (user_followings.includes(Number(profile_id))) {
        const follow_button = document.getElementById("follow_button")
        follow_button.innerText = "팔로우 취소"
    }
    else {
        const follow_button = document.getElementById("follow_button")
        follow_button.innerText = "팔로우"
    }
}

// ajax를 이용한 팔로우 기능 추가
function userFollow() {
    const urlParams = new URL(location.href).searchParams;
    const profile_id = urlParams.get('id');
    const follow_button = document.getElementById("follow_button")

    $.ajax({
        url : 'http://127.0.0.1:8000/users/follow/'+profile_id+'/',
        type : "POST",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
        },
        success: function(data){
            if(data === "follow") {
                follow_button.innerText = "팔로우 취소"
            }
            else {
                follow_button.innerText = "팔로우"
            }
        }
    })
}

// 미리보기 기능
function preview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("profile_image").src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
    else {
        document.getElementById("profile_image").src = "";
    }
}

//수정하기 기능
async function profileEdit() {
    const user = localStorage.getItem("payload")
    const user_id = user.split(':')[5].slice(0, -1);

    const response = await fetch('http://127.0.0.1:8000/users/profile/'+user_id+'/', {
        method:"GET"
    })
    response_json = await response.json()

    const email = response_json["가입정보"]["email"]
    const password = response_json["가입정보"]["password"]
    const profile_keyword = document.getElementById("profile_keyword").value;
    const profile_image = document.getElementById("profile_image").src;

    // 파일이 있다.
    if (response_json["가입정보"]["profile_image_image"]) {
        if ('http://127.0.0.1:8000' + response_json["가입정보"]['profile_image_image']!==profile_image && profile_keyword!=='') {
            alert("이미지 파일 또는 키워드 둘 중에 하나만 입력해주세요.")
        }
        else if('http://127.0.0.1:8000' + response_json["가입정보"]['profile_image_image']===profile_image && profile_keyword!=='') {
            const response_edit = await fetch('http://127.0.0.1:8000/users/profile/'+user_id+'/', {
            headers:{
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
                'content-type':'application/json',
            },
            method:"PUT",
            body: JSON.stringify({
                "email":email,
                "password":password,
                "profile_image":profile_keyword,
                "profile_image_image":''
            })
        })
        location.href = `../users/profile.html?id=${user_id}`
        }
        else if('http://127.0.0.1:8000' + response_json["가입정보"]['profile_image_image']!==profile_image && profile_keyword==='') {
            const response_edit = await fetch('http://127.0.0.1:8000/users/profile/'+user_id+'/', {
            headers:{
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
                'content-type':'application/json',
            },
            method:"PUT",
            body: JSON.stringify({
                "email":email,
                "password":password,
                "profile_image":'',
                "profile_image_image":profile_image
            })
        })
        location.href = `../users/profile.html?id=${user_id}`
        }
        else {
            alert("입력되지 않았습니다. 취소하시려면 뒤로가기 버튼을 눌러주세요.")
        }
    }
    // 파일 없다.
    else {
        if (response_json["가입정보"]['profile_image_url']!==profile_image && profile_keyword!=='') {
            alert("이미지 파일 또는 키워드 둘 중에 하나만 입력해주세요.")
        }
        else if(response_json["가입정보"]['profile_image_url']===profile_image && profile_keyword!=='') {
            const response_edit = await fetch('http://127.0.0.1:8000/users/profile/'+user_id+'/', {
            headers:{
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
                'content-type':'application/json',
            },
            method:"PUT",
            body: JSON.stringify({
                "email":email,
                "password":password,
                "profile_image":profile_keyword,
                "profile_image_image":''
            })
        })
        location.href = `../users/profile.html?id=${user_id}`
        }
        else if(response_json["가입정보"]['profile_image_url']!==profile_image && profile_keyword==='') {
            const response_edit = await fetch('http://127.0.0.1:8000/users/profile/'+ user_id +'/', {
            headers:{
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
                'content-type':'application/json',
            },
            method:"PUT",
            body: JSON.stringify({
                "email":email,
                "password":password,
                "profile_image":'',
                "profile_image_image":profile_image
            })
        })
        location.href = `../users/profile.html?id=${user_id}`
        }
        else {
            alert("입력되지 않았습니다. 취소하시려면 뒤로가기 버튼을 눌러주세요.")
        }
    }
}

// 탈퇴하기 기능
async function withdRaw() {
    const user = localStorage.getItem("payload")
    const user_id = user.split(':')[5].slice(0, -1);

    const response = await fetch('http://127.0.0.1:8000/users/profile/'+user_id+'/', {
        headers:{
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type':'application/json',
        },    
        method:"DELETE"
    })
    location.href = '../users/login.html'
}