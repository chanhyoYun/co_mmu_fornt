window.onload = async function loadMainPage() {
    const response = await fetch('http://127.0.0.1:8000/articles/', {
        method:"GET"
    })
    response_json = await response.json()

    const articles_all = document.getElementById("articles_all")
    response_json.forEach(article => {
        const articles = document.createElement("li")
        const articles_a = document.createElement("a")
        articles_a.setAttribute("href", `/templates/article/detail_article.html?id=${article['id']}`)
        articles_a.setAttribute("class", "article_container")
        articles.appendChild(articles_a)
        articles.setAttribute("class", "article_card")
        
        const articles_title = document.createElement("h3")
        articles_title.innerText = article['title']
        const articles_content = document.createElement("p")
        articles_content.innerText = article['content']

        if (article['image']!==null) {
            const articles_img = document.createElement('img')
            articles_img.setAttribute("src", 'http://127.0.0.1:8000'+article['image'])
            articles_a.appendChild(articles_img)
        }

        articles_a.appendChild(articles_title)
        articles_a.appendChild(articles_content)
        articles_all.appendChild(articles)
    })
    
}