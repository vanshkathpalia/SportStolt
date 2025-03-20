import { Calendar, MapPin, Trophy, Users } from "lucide-react"
import { Button } from "../ui/button"
import type { EventInterface } from '../../hooks';

interface EventHomeSidebarProps {
  events: EventInterface[]
  onRegister: () => void // Add this line to accept the prop
}

export const EventHomeSidebar = ({ events, onRegister }: EventHomeSidebarProps) => {
  return (
    <div className="p-10 sticky top-4 ">
      <div className="flex items-center mb-6">
        <Trophy className="h-6 w-6 mr-2 text-green-500" />
        <h2 className="text-lg font-semibold">Upcoming Top Events</h2>
      </div>
      

      
      <div className="space-y-4 max-h-[455px]  overflow-auto pr-2 ">
        {events.map((event) => (
          <div key={event.id} className="border border-border rounded-lg p-4 hover:border-green-500 transition-colors">
            <h3 className="font-medium mb-2">{event.name}</h3>
            <div className="text-sm text-muted-foreground mb-2 space-y-1">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-green-500" />
                <span>
                  {event.state} • {event.country}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-green-500" />
                <span>{event.stadium}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm">{event.city} hello organizers...</span>
              </div>
              <Button
                    onClick={onRegister}
                    className="w-auto bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                    Join Event
              </Button>
            </div>
            {/* <Button
                    onClick={onRegister} size="sm"
                    className=" bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                    Join Event
            </Button> */}
            
          </div> 
        ))}
      </div>
      <hr />
    </div>
  )
}


