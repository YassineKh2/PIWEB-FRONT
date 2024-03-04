import {Link} from "react-router-dom";

export default function ShowTeam() {
    return (
        <div className="w-full py-6 space-y-6 md:py-12 bg-primary/5">
            <div className="container grid max-w-6xl gap-6 px-4 md:px-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Barcelona FC</h1>
                    <p className="text-gray-500 dark:text-gray-400">More than a club.</p>
                </div>
                <div className="grid items-start gap-6 lg:grid-cols-[200px,1fr] xl:gap-10">
                    <div className="flex items-start gap-4">
                        <img
                            alt="Team logo"
                            className="rounded-lg border aspect-[1/1] overflow-hidden object-cover object-center"
                            height="200"
                            src="/placeholder.svg"
                            width="200"
                        />
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-1">
                            <h2 className="text-2xl font-bold">About</h2>
                            <p className="text-gray-500 md:max-w-prose dark:text-gray-400">
                                {`\n                Founded in 1899 by a group of Swiss, English, German, and\n                Catalan footballers led by Joan Gamper, the club has become a\n                symbol of Catalan culture and Catalanism, hence the motto "Me\u{301}s\n                que un club" (More than a club).\n              `}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <div className="grid gap-1">
                            <h2 className="text-2xl font-bold">Players</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-4">
                                    <img
                                        alt="Player"
                                        className="rounded-full object-cover object-center"
                                        height="80"
                                        src="/placeholder.svg"
                                        style={{
                                            aspectRatio: "80/80",
                                            objectFit: "cover",
                                        }}
                                        width="80"
                                    />
                                    <div className="grid gap-1.5">
                                        <h3 className="font-bold">Lionel Messi</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Forward</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        alt="Player"
                                        className="rounded-full object-cover object-center"
                                        height="80"
                                        src="/placeholder.svg"
                                        style={{
                                            aspectRatio: "80/80",
                                            objectFit: "cover",
                                        }}
                                        width="80"
                                    />
                                    <div className="grid gap-1.5">
                                        <h3 className="font-bold">Gerard Pique</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Defender</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        alt="Player"
                                        className="rounded-full object-cover object-center"
                                        height="80"
                                        src="/placeholder.svg"
                                        style={{
                                            aspectRatio: "80/80",
                                            objectFit: "cover",
                                        }}
                                        width="80"
                                    />
                                    <div className="grid gap-1.5">
                                        <h3 className="font-bold">Sergio Busquets</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Midfielder</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        alt="Player"
                                        className="rounded-full object-cover object-center"
                                        height="80"
                                        src="/placeholder.svg"
                                        style={{
                                            aspectRatio: "80/80",
                                            objectFit: "cover",
                                        }}
                                        width="80"
                                    />
                                    <div className="grid gap-1.5">
                                        <h3 className="font-bold">Ansu Fati</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Forward</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold">Achievements</h2>
                            <div className="flex flex-col gap-4">
                                <div className=" items-center gap-2 bg-white rounded-3xl p-4 shadow">
                                    <p>La Liga: 26 titles</p>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-2">
                                    <p>La Liga: 26 titles</p>
                                </div>
                                <a href="#"
                                   className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-white hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                    <svg aria-hidden="true" className="h-5" viewBox="0 0 292 292" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M145.7 291.66C226.146 291.66 291.36 226.446 291.36 146C291.36 65.5541 226.146 0.339844 145.7 0.339844C65.2542 0.339844 0.0400391 65.5541 0.0400391 146C0.0400391 226.446 65.2542 291.66 145.7 291.66Z"
                                            fill="#3259A5"/>
                                        <path
                                            d="M195.94 155.5C191.49 179.08 170.8 196.91 145.93 196.91C117.81 196.91 95.0204 174.12 95.0204 146C95.0204 117.88 117.81 95.0897 145.93 95.0897C170.8 95.0897 191.49 112.93 195.94 136.5H247.31C242.52 84.7197 198.96 44.1797 145.93 44.1797C89.6904 44.1797 44.1104 89.7697 44.1104 146C44.1104 202.24 89.7004 247.82 145.93 247.82C198.96 247.82 242.52 207.28 247.31 155.5H195.94Z"
                                            fill="white"/>
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Coinbase Wallet</span>
                                </a>
                                <div className="grid grid-cols-2 items-center gap-2">
                                    <p>FIFA Club World Cup: 3 titles</p>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-2">
                                    <p>FIFA Club World Cup: 3 titles</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold">Upcoming Matches</h2>
                            <div className="flex flex-col gap-4">
                                <Link  to="" className="flex items-center gap-2 p-3 md:gap-10 text-base font-bold text-gray-900 rounded-lg bg-white hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">

                                        <span className="flex-1 ms-3 whitespace-nowrap">Barcelona<text className="text-xl">&nbsp;vs{' '}&nbsp;</text>Real Madrid </span>
                                        <p className="text-center text-white bg-blue-400 rounded-2xl p-2 text-xs">May 1, 2023</p>

                                </Link>


                            </div>
                        </div>
                    </div>

                </div>
                <div className="grid gap-1">
                    <h2 className="text-2xl font-bold">Gallery</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

