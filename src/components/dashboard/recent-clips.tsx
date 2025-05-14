import { MoreHorizontal, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const recentClips = [
  {
    id: "clip-1",
    title: "Epic Valorant Ace",
    views: "12.4K",
    duration: "0:42",
    thumbnail: "/placeholder.svg?height=120&width=200",
    date: "2 hours ago",
  },
  {
    id: "clip-2",
    title: "Minecraft Speedrun Highlight",
    views: "8.7K",
    duration: "1:15",
    thumbnail: "/placeholder.svg?height=120&width=200",
    date: "Yesterday",
  },
  {
    id: "clip-3",
    title: "Fortnite Victory Royale",
    views: "3.2K",
    duration: "0:58",
    thumbnail: "/placeholder.svg?height=120&width=200",
    date: "3 days ago",
  },
]

export function RecentClips() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Recent Clips</CardTitle>
          <CardDescription>Your latest created clips</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentClips.map((clip) => (
            <div key={clip.id} className="flex items-center gap-4">
              <div className="relative rounded-md overflow-hidden w-[120px] h-[68px] bg-muted">
                <img
                  src={clip.thumbnail || "/placeholder.svg"}
                  alt={clip.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                  <Button size="icon" variant="ghost" className="text-white">
                    <Play className="h-8 w-8 fill-white" />
                  </Button>
                </div>
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                  {clip.duration}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{clip.title}</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{clip.views} views</span>
                  <span className="mx-1">•</span>
                  <span>{clip.date}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
