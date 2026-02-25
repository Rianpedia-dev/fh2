import {
    getPmbTracks, getPmbClasses, getPmbTeam,
    getPmbRequirements, getPmbFeeCategories, getPmbFeeItems,
} from "@/db/queries";
import PmbClient from "./pmb-client";

export default async function AdminPmbPage() {
    const [tracks, classes, team, requirements, feeCategories, feeItems] = await Promise.all([
        getPmbTracks(),
        getPmbClasses(),
        getPmbTeam(),
        getPmbRequirements(),
        getPmbFeeCategories(),
        getPmbFeeItems(),
    ]);

    return (
        <PmbClient
            tracks={tracks}
            classes={classes}
            team={team}
            requirements={requirements}
            feeCategories={feeCategories}
            feeItems={feeItems}
        />
    );
}
