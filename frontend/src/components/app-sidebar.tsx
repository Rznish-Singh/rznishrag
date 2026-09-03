"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  BrainCircuit,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  BookSearch,
  MessageCircleCode,
  Download,
  Icon,
  BadgeQuestionMark,
  icons,
  Notebook,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "rajnish",
    email: "rajnishsingh@gmail.com",
    avatar: "/avatar/1.png",
  },
  teams: [
    {
      name: "Rznish Ai✨",
      // avatar: "/avatar/1.png",
      logo: BrainCircuit,
      plan: "",
    },
    // {  add more if you want 
    //   name: "Rznish",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
   
  ],
  navMain: [
    {
      title: "ChatApp",
      url: "https://rznish-demo.vercel.app/",
      icon: MessageCircleCode,
      isActive: true,
      items: [
        {
          title: "Download",
          url: "https://rznish-demo.vercel.app/download",
          icon: Download,
        },
        {
          title: "FAQ",
          url: "https://rznish-demo.vercel.app/faq",
          Icon : BadgeQuestionMark,
        },
        {
          title: "Blog",
          url: "https://rznish-demo.vercel.app/blog",
          icon : Notebook,
        },
      ],
    },
   
  ],
  projects: [
    {
      name: "RznishRAG Lite",
      url: "/kb",
      icon: BookSearch,
    },
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
