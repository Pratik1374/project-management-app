import { StackContext, NextjsSite } from "sst/constructs";

export function MyStack({ stack }: StackContext) {
  const site = new NextjsSite(stack, "Site", {
    path: ".",
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
