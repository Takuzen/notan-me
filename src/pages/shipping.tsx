import Link from 'next/link'

export default function Notes() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-24 lg:pt-[70px] lg:gap-8">
      <h3 className='inline sm:hidden text-blue-700 leading-loose tracking-wide mt-5'>
        会員登録が無事完了しました。<br></br>
        ご協力ありがとうございます。
      </h3>
      <h3 className='hidden sm:inline text-blue-500 tracking-wide'>会員登録が無事完了しました。
        ご協力ありがとうございます。
      </h3>

      <p className='bg-gray-100 font-bold sm:text-2xl text-center leading-loose sm:tracking-wide shadow-lg p-8 sm:p-40 rounded-lg'>
      〒 116 - 0001 <br></br>
      東京都荒川区町屋1-17-16-101 <br></br>
      のーたん スキャンセンター 宛
      </p>

      <p className='inline sm:hidden text-center leading-loose tracking-wide'>
        ※ 注意事項 ※<br></br>
        <u>著作権のある書物以外</u><br></br>概ね受け付けております
      </p>
      <p className='hidden sm:inline text-center leading-loose tracking-wide'>
        注意事項 <br></br>
        <u>著作権のある書物以外</u>は、概ね受け付けております
      </p>

      <p className="text-white font-semibold bg-yellow-500 px-5 py-3 rounded-full"><Link href="https://www.kuronekoyamato.co.jp/ytc/customer/send/members/shuka/">クロネコヤマトの集荷を利用する</Link></p>
    </main>
  )
}