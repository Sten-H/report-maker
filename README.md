## Where to look

The report creation code is under `src/lib/report`, reading the tests in `contract.test.ts` in `__tests__` folder could help in understanding how they're supposed to work.

## Thoughts

### Approach

I couldn't really figure out if there was a set way that I should read the contract events. To me there were two options:

* Read all events at once and construct a sort of history, them create the report after all events are read.
* Since the events seem to be sorted by month I can read the events one month at a time and construct the report as I read the events.
  * This assumes that a termination is only known (and read) the same date that it is terminated. That seems to align with what I see in the description, but it's a pretty **big assumption**.

I chose the second way because it seems like that is the way the example reports are generated in that they don't have knowledge of future price changes when showing expected gross. This oculd be done with first alternative too but I'd have to add some kind of meta data of when a price change is known to the contract data I think.

Other than that I couldn't figure out the expected gross values of feb and mar in the case 1 output of the pdf. It looks incorrect to me, this probably means there's something I've misunderstood but can't figure out what that would be. To me the expected gross of feb should know that it shouldn't draw for the previous month of the contract that just started in feb, to me 2300 makes sense. I've got a feeling I'm going to feel plenty dumb about this.

### Code style

I was a little afraid that the report generation could become slow due to the amount of events so I decided to sort of code a little old school (some would say) using for/while loops for early exits and mutating data as I go.

### Other

Didn't really have time to make sure that the full case with price adjustments works properly. If I had time I would make some tests to compare against the pdf output of case 2.
