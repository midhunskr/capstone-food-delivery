import React from 'react'
import { GroupComponent } from './GroupComponent'
import { FrameComponent2 } from './FrameComponent2'
import { FrameComponent4 } from './FrameComponent4'

export const MobileAppSection = () => {
  return (
    <div>
        <section className="w-[67.5rem]self-stretch bg-bg-white overflow-hidden flex flex-col items-end justify-start pt-[12.125rem] px-[9.75rem] pb-[3.312rem] box-border relative gap-[8.031rem] max-w-full text-left text-[2.5rem] text-bg-white font-arial-rounded-mt-bold mq450:gap-[2rem] mq450:pl-[1.25rem] mq450:pr-[1.25rem] mq450:box-border mq800:gap-[4rem] mq800:pt-[5.125rem] mq800:px-[4.875rem] mq800:pb-[1.375rem] mq800:box-border mq1125:pt-[7.875rem] mq1125:pb-[2.125rem] mq1125:box-border">
            <div className="w-[53.844rem] flex flex-row items-start justify-end py-[0rem] px-[2.625rem] box-border max-w-full mq800:pl-[1.313rem] mq800:pr-[1.313rem] mq800:box-border">
            <div className="flex-1 flex flex-row items-start justify-start flex-wrap content-start gap-[2.5rem] max-w-full mq800:gap-[1.25rem]">
                <h2 className="m-0 w-[20.063rem] relative text-inherit font-normal font-[inherit] inline-block shrink-0 max-w-full z-[1] mq450:text-[1.5rem] mq800:text-[2rem]">
                <p className="m-0">Download</p>
                <p className="m-0">our Mobile App</p>
                </h2>
                <div className="flex-1 flex flex-col items-start justify-start pt-[5.562rem] px-[0rem] pb-[0rem] box-border min-w-[14.313rem] max-w-full">
                <div className="self-stretch flex flex-row items-start justify-start gap-[1.125rem] mq450:flex-wrap">
                    <GroupComponent
                    playStoreIcon="/play-store-icon.svg"
                    playStoreSeparator="4.5/5"
                    />
                    <GroupComponent
                    playStoreIcon="/app-store-icon@2x.png"
                    playStoreSeparator="4.8/5"
                    />
                </div>
                </div>
            </div>
            </div>
        <FrameComponent2 />
        <FrameComponent4 />
        </section>

    </div>
  )
}
