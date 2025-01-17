const blogTitleField = document.querySelector('title')
const articleField = document.querySelector('article')

const bannerImage = document.querySelector('#banner-upload')
const banner = document.querySelector('.banner')
let bannerPath

const publishBtn = document.querySelector('.publish-btn')
const uploadInput = document.querySelector('#image-upload')

const uploadImage = (uploadFile, uploadType) => {
  const [file] = uploadFile.files
  if (file && file.type.includes('image')) {
    const formdata = new FormData()
    formdata.append('image', file)

    fetch('/upload', {
      method: 'post',
      body: formdata,
    })
      .then(res => res.json())
      .then(data => {
        if (uploadType == 'image') {
          addImage(data, file.name)
        } else {
          bannerPath = `${location.origin}/${data}`
          banner.style.backgroundImage = `url("${bannerPath}")`
        }
      })
  } else {
    alert('upload Image only')
  }
}

const app.post('/upload', (req, res) => {
  let file = req.files.image
  let date = new Date()
  // image name
  let imagename = date.getDate() + date.getTime() + file.name
  // image upload path
  let path = 'public/uploads/' + imagename

  // create upload
  file.mv(path, (err, result) => {
    if (err) {
      throw err
    } else {
      // our image upload path
      res.json(`uploads/${imagename}`)
    }
  });
});

const addImage = (imagepath, alt) => {
  let curPos = articleField.selectionStart
  let textToInsert = `\r![${alt}](${imagepath})\r`
  articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos)
}

let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

publishBtn.addEventListener('click', () => {
  if (articleField.value.length && blogTitleField.value.length) {
    // generating id
    let letters = 'abcdefghijklmnopqrstuvwxyz'
    let blogTitle = blogTitleField.value.split(' ').join('-')
    let id = ''
    for (let i = 0; i < 4; i++) {
      id += letters[Math.floor(Math.random() * letters.length)]
    }

    // setting up docName
    let docName = `${blogTitle}-${id}`
    let date = new Date() // for published at info

    //access firestore with db variable;
    db.collection('blogs')
      .doc(docName)
      .set({
        title: blogTitleField.value,
        article: articleField.value,
        bannerImage: bannerPath,
        publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
      })
      .then(() => {
        location.href = `/${docName}`
      })
      .catch(err => {
        console.error(err)
      })
    /* ?? 
    */
  }
})
