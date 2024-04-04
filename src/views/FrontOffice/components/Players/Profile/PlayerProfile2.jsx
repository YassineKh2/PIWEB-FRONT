export default function PlayerProfile2() {
    return (
        <>
            <section className="bg-primary/5 ">
                <div className="flex flex-col ml-5">
                    <div className="flex justify-between mt-5">
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col">
                                <p className="text-gray-400 text-2xl">Mostfa</p>
                                <p className="text-semibold text-5xl">Ben Hamadi</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-10">
                                    <p className="text-gray-400">CURRENT CLUB</p>
                                    <p>CAB</p>
                                </div>
                                <div className="flex gap-10">
                                    <p className="text-gray-400">POSITION</p>
                                    <p>Forward</p>
                                </div>
                                <div className="flex gap-10">
                                    <p className="text-gray-400">BIRTHDATE</p>
                                    <p>Dec 18,1980</p>
                                </div>
                                <div className="flex gap-10">
                                    <p className="text-gray-400">NATIONALITY</p>
                                    <p>Tunisian</p>
                                </div>
                                <div className="flex gap-10">
                                    <p className="text-gray-400">PROFILE</p>
                                    <p>198cm/ 80kg</p>
                                </div>
                                <div className="flex gap-10">
                                    <p className="text-gray-400">SIGNED AT CAB</p>
                                    <p>AUG 19 , 2019</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end ">
                            <img
                                src="https://imageio.forbes.com/specials-images/imageserve/5f5be112e7f395dc08ef8e58/Lionel-Messi-celebrating-scoring-a-goal-in-the-2019-20-UEFA-Champions-League/1960x0.jpg?format=jpg&width=960"
                                alt="player image"
                                className="w-3/5 rounded-3xl"
                            />
                            <h1 className="md:text-[300px] text-[#212438] relative top-20">10</h1>
                        </div>
                    </div>
                    <div>
                        <h1>Player Profile 2</h1>
                    </div>
                </div>
            </section>
        </>
    )
}