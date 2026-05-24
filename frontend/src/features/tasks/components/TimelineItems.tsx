import { useState } from "react";
import { activityFormatter } from "../../../common/utils/activityFormatter";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDateTimeShort } from "../../../common/utils/dateFormatter";

interface Props {
  name: string;
  message: string;
  createdAt: string;
  isLast: boolean;
}

export default function TimelineItem({
  name,
  message,
  createdAt,
  isLast,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 200;

  const isLong = message.length > MAX_LENGTH;

  const displayMessage =
    !isLong || expanded ? message : message.slice(0, MAX_LENGTH) + "...";

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-2 w-2 rounded-full bg-foreground" />

        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>

      <div className="flex-1 pb-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-7 w-7">
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div className="text-sm leading-tight">
              <span className="font-medium">{name}</span>{" "}
              <span className="text-muted-foreground">
                {activityFormatter(displayMessage)}
              </span>
              {isLong && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="
      h-auto p-0 mt-1
      text-xs text-muted-foreground
      hover:text-foreground
      flex items-center gap-1
    "
                >
                  {expanded ? (
                    <>
                      Show less <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </Button>
              )}
            </div>

            <span className="text-xs text-muted-foreground mt-1">
              {formatDateTimeShort(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
