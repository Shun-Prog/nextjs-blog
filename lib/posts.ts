import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), "posts")

export function getSortedPostsData() {

  // /posts配下のファイル名を取得
  const fileNames = fs.readdirSync(postsDirectory)

  const allPostsData = fileNames.map(fileName => {

    // ファイル名の.mdを除去してidにする
    const id = fileName.replace(/\.md$/, '')

    // stringとしてmdファイルを読み込む
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // gray-matterを利用してmatadataをパースする
    const matterResult = matter(fileContents)

    // dataとidを結合する
    return {
      id,
      ...matterResult.data
    }
  })

  return allPostsData.sort((a: any, b: any) => {
    return a.date < b.date? 1 : -1
  })

}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // gray-matterを利用してmatadataをパースする
  const matterResult = matter(fileContents)

  // remarkを利用してmdファイルをhtml stringに変換
  const processedContent = await remark()
  .use(html)
  .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // dataとidを結合する
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}
